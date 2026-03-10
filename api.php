<?php
// api/auth.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once __DIR__ . '/../classes/User.php';

$user = new User();
$request_method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"));

switch($request_method) {
    case 'POST':
        if(isset($_GET['action'])) {
            switch($_GET['action']) {
                case 'register':
                    handleRegister($user, $data);
                    break;
                case 'login':
                    handleLogin($user, $data);
                    break;
                case 'logout':
                    handleLogout($user);
                    break;
                case 'reset-password':
                    handlePasswordReset($user, $data);
                    break;
                case 'request-reset':
                    handleResetRequest($user, $data);
                    break;
                default:
                    http_response_code(404);
                    echo json_encode(["message" => "Action not found"]);
            }
        }
        break;
        
    case 'GET':
        if(isset($_GET['action']) && $_GET['action'] === 'validate') {
            validateSession($user);
        } elseif(isset($_GET['user_id'])) {
            getUserProfile($user, $_GET['user_id']);
        }
        break;
        
    case 'PUT':
        if(isset($_GET['action']) && $_GET['action'] === 'update-profile') {
            updateUserProfile($user, $data);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
}

function handleRegister($user, $data) {
    if(
        !empty($data->username) &&
        !empty($data->email) &&
        !empty($data->password) &&
        !empty($data->full_name)
    ) {
        $user->username = $data->username;
        $user->email = $data->email;
        $user->password = $data->password;
        $user->full_name = $data->full_name;
        $user->role = $data->role ?? 'student';
        $user->department = $data->department ?? '';
        $user->semester = $data->semester ?? null;
        $user->enrollment_number = $data->enrollment_number ?? '';

        if($user->register()) {
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "User registered successfully",
                "user_id" => $user->id
            ]);
        } else {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Username or email already exists"
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Unable to register. Missing required fields."
        ]);
    }
}

function handleLogin($user, $data) {
    if(!empty($data->email) && !empty($data->password)) {
        $result = $user->login($data->email, $data->password);
        
        if($result['success']) {
            http_response_code(200);
            echo json_encode($result);
        } else {
            http_response_code(401);
            echo json_encode($result);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Email and password are required"
        ]);
    }
}

function handleLogout($user) {
    $headers = getallheaders();
    if(isset($headers['Authorization'])) {
        $token = str_replace('Bearer ', '', $headers['Authorization']);
        if($user->logout($token)) {
            echo json_encode([
                "success" => true,
                "message" => "Logged out successfully"
            ]);
        } else {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Logout failed"
            ]);
        }
    }
}

function validateSession($user) {
    $headers = getallheaders();
    if(isset($headers['Authorization'])) {
        $token = str_replace('Bearer ', '', $headers['Authorization']);
        $user_id = $user->validateSession($token);
        
        if($user_id) {
            $user_data = $user->getUserById($user_id);
            echo json_encode([
                "success" => true,
                "valid" => true,
                "user" => $user_data
            ]);
        } else {
            echo json_encode([
                "success" => true,
                "valid" => false
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No token provided"
        ]);
    }
}

function getUserProfile($user, $user_id) {
    $user_data = $user->getUserById($user_id);
    if($user_data) {
        echo json_encode([
            "success" => true,
            "user" => $user_data
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);
    }
}

function updateUserProfile($user, $data) {
    $headers = getallheaders();
    if(isset($headers['Authorization'])) {
        $token = str_replace('Bearer ', '', $headers['Authorization']);
        $user_id = $user->validateSession($token);
        
        if($user_id && $user_id == $data->user_id) {
            if($user->updateProfile($user_id, (array)$data)) {
                echo json_encode([
                    "success" => true,
                    "message" => "Profile updated successfully"
                ]);
            } else {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Failed to update profile"
                ]);
            }
        } else {
            http_response_code(403);
            echo json_encode([
                "success" => false,
                "message" => "Unauthorized"
            ]);
        }
    }
}

function handlePasswordReset($user, $data) {
    if(!empty($data->token) && !empty($data->new_password)) {
        if($user->resetPassword($data->token, $data->new_password)) {
            echo json_encode([
                "success" => true,
                "message" => "Password reset successfully"
            ]);
        } else {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Invalid or expired token"
            ]);
        }
    }
}

function handleResetRequest($user, $data) {
    if(!empty($data->email)) {
        $result = $user->requestPasswordReset($data->email);
        if($result['success']) {
            // In production, send email here
            echo json_encode([
                "success" => true,
                "message" => "Password reset email sent",
                "reset_token" => $result['token'] // Remove in production
            ]);
        } else {
            echo json_encode([
                "success" => true,
                "message" => "If email exists, reset link will be sent"
            ]);
        }
    }
}
?>
