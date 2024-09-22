-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_author_id_fkey";

-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_question_id_fkey";

-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_answer_id_fkey";

-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_question_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_answer_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_author_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_question_id_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_recipient_id_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_author_id_fkey";

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
