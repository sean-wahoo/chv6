/*
  Warnings:

  - A unique constraint covering the columns `[session_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `users_session_id_key` ON `users`(`session_id`);
