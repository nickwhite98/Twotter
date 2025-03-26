PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_replies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`text` text NOT NULL,
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP),
	`user_id` integer,
	`parent_note_id` integer DEFAULT 'null',
	`parent_comment_id` integer DEFAULT 'null',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parent_note_id`) REFERENCES `notes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parent_comment_id`) REFERENCES `replies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_replies`("id", "text", "timestamp", "user_id", "parent_note_id", "parent_comment_id") SELECT "id", "text", "timestamp", "user_id", "parent_note_id", "parent_reply_id" FROM `replies`;--> statement-breakpoint
DROP TABLE `replies`;--> statement-breakpoint
ALTER TABLE `__new_replies` RENAME TO `replies`;--> statement-breakpoint
PRAGMA foreign_keys=ON;