<?php
// classes/User.php
require_once __DIR__ . '/../config/database.php';

class User {
    private $conn;
    private $table_name = "users";

    // User properties
    public $id;
    public $username;
    public $email;
    public $password;
    public $full_name;
    public $role;
    public $department;
    public $semester;
    public $enrollment_number;
    public $profile_pic;
    public $bio;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // Register new user
    public function register() {
        // Check if user exists
        if($this->emailExists()) {
            return false;
        }

        $query = "INSERT INTO " . $this->table_name . "
                  SET
                    username = :username,
                    email = :email,
                    password_hash = :password_hash,
                    full_name = :full_name,
                    role = :role,
                    department = :department,
                    semester = :semester,
                    enrollment_number = :enrollment_number";

        $stmt = $this->conn->prepare($query);

        // Sanitize input
        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->full_name = htmlspecialchars(strip_tags($this->full_name));
        $this->role = htmlspecialchars(strip_tags($this->role));
        $this->department = htmlspecialchars(strip_tags($this->department));
        $this->semester = htmlspecialchars(strip_tags($this->semester));
        $this->enrollment_number = htmlspecialchars(strip_tags($this->enrollment_number));

        // Hash password
        $password_hash = password_hash($this->password, PASSWORD_BCRYPT);

        // Bind values
        $stmt->bindParam(":username", $this->username);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password_hash", $password_hash);
        $stmt->bindParam(":full_name", $this->full_name);
        $stmt->bindParam(":role", $this->role);
        $stmt->bindParam(":department", $this->department);
        $stmt->bindParam(":semester", $this->semester);
        $stmt->bindParam(":enrollment_number", $this->enrollment_number);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            $this->logActivity('user_registered');
            return true;
        }
        return false;
    }

    // Login user
    public function login($email, $password) {
        $query = "SELECT id, username, email, password_hash, full_name, role, 
                         profile_pic, is_active
                  FROM " . $this->table_name . "
                  WHERE email = :email OR username = :email
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if(password_verify($password, $row['password_hash'])) {
                if(!$row['is_active']) {
                    return ['success' => false, 'message' => 'Account is deactivated'];
                }

                // Update last login
                $this->updateLastLogin($row['id']);
                
                // Log activity
                $this->logActivity('user_login', null, $row['id']);

                // Create session
                $session_token = $this->createSession($row['id']);

                return [
                    'success' => true,
                    'user' => [
                        'id' => $row['id'],
                        'username' => $row['username'],
                        'email' => $row['email'],
                        'full_name' => $row['full_name'],
                        'role' => $row['role'],
                        'profile_pic' => $row['profile_pic']
                    ],
                    'session_token' => $session_token
                ];
            }
        }
        return ['success' => false, 'message' => 'Invalid credentials'];
    }

    // Check if email exists
    private function emailExists() {
        $query = "SELECT id FROM " . $this->table_name . " WHERE email = :email OR username = :username LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":username", $this->username);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    // Update last login
    private function updateLastLogin($user_id) {
        $query = "UPDATE " . $this->table_name . " SET last_login = NOW() WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $user_id);
        $stmt->execute();
    }

    // Create user session
    private function createSession($user_id) {
        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime('+30 days'));

        $query = "INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, expires_at)
                  VALUES (:user_id, :token, :ip, :ua, :expires)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":token", $token);
        $stmt->bindParam(":ip", $_SERVER['REMOTE_ADDR']);
        $stmt->bindParam(":ua", $_SERVER['HTTP_USER_AGENT']);
        $stmt->bindParam(":expires", $expires);
        $stmt->execute();

        return $token;
    }

    // Validate session
    public function validateSession($token) {
        $query = "SELECT user_id FROM user_sessions 
                  WHERE session_token = :token AND expires_at > NOW()";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":token", $token);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return $row['user_id'];
        }
        return false;
    }

    // Logout - destroy session
    public function logout($token) {
        $query = "DELETE FROM user_sessions WHERE session_token = :token";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":token", $token);
        return $stmt->execute();
    }

    // Get user by ID
    public function getUserById($id) {
        $query = "SELECT u.*, up.* 
                  FROM " . $this->table_name . " u
                  LEFT JOIN user_profiles up ON u.id = up.user_id
                  WHERE u.id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Update user profile
    public function updateProfile($user_id, $data) {
        $query = "UPDATE " . $this->table_name . "
                  SET full_name = :full_name,
                      department = :department,
                      semester = :semester,
                      phone = :phone,
                      bio = :bio
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":full_name", $data['full_name']);
        $stmt->bindParam(":department", $data['department']);
        $stmt->bindParam(":semester", $data['semester']);
        $stmt->bindParam(":phone", $data['phone']);
        $stmt->bindParam(":bio", $data['bio']);
        $stmt->bindParam(":id", $user_id);

        if($stmt->execute()) {
            // Update extended profile
            $this->updateExtendedProfile($user_id, $data);
            $this->logActivity('profile_updated', null, $user_id);
            return true;
        }
        return false;
    }

    // Update extended profile
    private function updateExtendedProfile($user_id, $data) {
        $query = "UPDATE user_profiles 
                  SET skills = :skills,
                      interests = :interests,
                      github_url = :github,
                      linkedin_url = :linkedin,
                      preferences = :preferences
                  WHERE user_id = :user_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":skills", json_encode($data['skills'] ?? []));
        $stmt->bindParam(":interests", json_encode($data['interests'] ?? []));
        $stmt->bindParam(":github", $data['github'] ?? '');
        $stmt->bindParam(":linkedin", $data['linkedin'] ?? '');
        $stmt->bindParam(":preferences", json_encode($data['preferences'] ?? []));
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();
    }

    // Log user activity
    private function logActivity($action, $details = null, $user_id = null) {
        $uid = $user_id ?? $this->id;
        if(!$uid) return;

        $query = "INSERT INTO user_activity_logs (user_id, action, details, ip_address)
                  VALUES (:user_id, :action, :details, :ip)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $uid);
        $stmt->bindParam(":action", $action);
        $stmt->bindParam(":details", json_encode($details));
        $stmt->bindParam(":ip", $_SERVER['REMOTE_ADDR']);
        $stmt->execute();
    }

    // Request password reset
    public function requestPasswordReset($email) {
        $query = "SELECT id FROM " . $this->table_name . " WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            $token = bin2hex(random_bytes(32));
            $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));

            $query = "INSERT INTO password_resets (user_id, token, expires_at)
                      VALUES (:user_id, :token, :expires)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":user_id", $user['id']);
            $stmt->bindParam(":token", $token);
            $stmt->bindParam(":expires", $expires);
            
            if($stmt->execute()) {
                return ['success' => true, 'token' => $token];
            }
        }
        return ['success' => false];
    }

    // Reset password
    public function resetPassword($token, $new_password) {
        $query = "SELECT user_id FROM password_resets 
                  WHERE token = :token AND expires_at > NOW() AND used = FALSE";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":token", $token);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Update password
            $password_hash = password_hash($new_password, PASSWORD_BCRYPT);
            $query = "UPDATE " . $this->table_name . " 
                      SET password_hash = :password 
                      WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":password", $password_hash);
            $stmt->bindParam(":id", $row['user_id']);
            
            if($stmt->execute()) {
                // Mark token as used
                $query = "UPDATE password_resets SET used = TRUE WHERE token = :token";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":token", $token);
                $stmt->execute();
                
                return true;
            }
        }
        return false;
    }

    // Get user activity
    public function getUserActivity($user_id, $limit = 10) {
        $query = "SELECT action, details, created_at 
                  FROM user_activity_logs 
                  WHERE user_id = :user_id 
                  ORDER BY created_at DESC 
                  LIMIT :limit";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":limit", $limit, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
