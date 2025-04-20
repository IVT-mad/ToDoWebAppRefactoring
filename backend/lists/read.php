<?php
header('Content-Type: application/json');

require_once('../middlewares/cors.php');
require_once __DIR__ . '/../middlewares/auth.php';
require_once __DIR__ . '/../middlewares/db.php';

$query = '
    SELECT l.*,
    (
      SELECT COUNT(*) 
      FROM tasks t 
      WHERE t.list_id = l.id AND t.is_deleted = 0
    ) AS task_count
    FROM lists l
    WHERE l.user_id = :user_id
';
$params = ['user_id' => $user_id];

$stmt = $pdo->prepare($query);
$stmt->execute($params);
$totalQuery = $pdo->prepare('
  SELECT COUNT(*) FROM tasks 
  WHERE is_deleted = 0 AND (
    user_id = :user_id OR group_id IN (
      SELECT group_id FROM group_users WHERE user_id = :user_id
    )
  )
');
$totalQuery->execute(['user_id' => $user_id]);
$totalCount = $totalQuery->fetchColumn();

$lists = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => true,
    'lists' => $lists,
    'total_tasks' => intval($totalCount)
]);
