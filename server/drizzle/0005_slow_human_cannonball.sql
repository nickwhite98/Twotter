ALTER TABLE `notes` ADD `is_reply` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `notes` ADD `parent_id` integer DEFAULT 'null';