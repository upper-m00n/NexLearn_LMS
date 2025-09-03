-- CreateTable
CREATE TABLE "public"."LectureCompletion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lectureId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LectureCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LectureCompletion_userId_lectureId_key" ON "public"."LectureCompletion"("userId", "lectureId");

-- AddForeignKey
ALTER TABLE "public"."LectureCompletion" ADD CONSTRAINT "LectureCompletion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LectureCompletion" ADD CONSTRAINT "LectureCompletion_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "public"."Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
