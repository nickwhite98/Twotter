PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`text` text NOT NULL,
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP),
	`user_id` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_notes`("id", "text", "timestamp", "user_id") SELECT "id", "text", "timestamp", "user_id" FROM `notes`;--> statement-breakpoint
DROP TABLE `notes`;--> statement-breakpoint
ALTER TABLE `__new_notes` RENAME TO `notes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;