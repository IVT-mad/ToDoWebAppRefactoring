
CREATE UNIQUE INDEX idx_username ON users(username);
CREATE UNIQUE INDEX idx_email ON users(email);

CREATE INDEX idx_owner_id ON `groups`(owner_id);

CREATE INDEX idx_user_id_lists ON lists(user_id);
CREATE INDEX idx_group_id_lists ON lists(group_id);

CREATE INDEX idx_user_id_tasks ON tasks(user_id);
CREATE INDEX idx_list_id_tasks ON tasks(list_id);
CREATE INDEX idx_due_date_tasks ON tasks(due_date);
CREATE INDEX idx_status_tasks ON tasks(status);
CREATE INDEX idx_priority_tasks ON tasks(priority);
CREATE INDEX idx_is_deleted_tasks ON tasks(is_deleted);
