-- CreateIndex
CREATE INDEX "myVocabularies_wordId_idx" ON "myVocabularies"("wordId");

-- CreateIndex
CREATE INDEX "testVenues_status_year_idx" ON "testVenues"("status", "year");

-- CreateIndex
CREATE INDEX "testVenues_status_year_class_idx" ON "testVenues"("status", "year", "class");

-- CreateIndex
CREATE INDEX "users_status_name_idx" ON "users"("status", "name");

-- CreateIndex
CREATE INDEX "users_status_importedStatus_idx" ON "users"("status", "importedStatus");

-- CreateIndex
CREATE INDEX "users_status_year_idx" ON "users"("status", "year");

-- CreateIndex
CREATE INDEX "users_status_class_idx" ON "users"("status", "class");

-- CreateIndex
CREATE INDEX "words_status_title_idx" ON "words"("status", "title");
