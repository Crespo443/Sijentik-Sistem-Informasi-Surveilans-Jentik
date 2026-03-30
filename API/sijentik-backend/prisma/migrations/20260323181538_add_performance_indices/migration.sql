-- CreateIndex
CREATE INDEX "access_codes_code_idx" ON "access_codes"("code");

-- CreateIndex
CREATE INDEX "districts_name_idx" ON "districts"("name");

-- CreateIndex
CREATE INDEX "health_centers_district_id_idx" ON "health_centers"("district_id");

-- CreateIndex
CREATE INDEX "health_centers_name_idx" ON "health_centers"("name");

-- CreateIndex
CREATE INDEX "survey_containers_survey_id_idx" ON "survey_containers"("survey_id");

-- CreateIndex
CREATE INDEX "survey_interventions_survey_id_idx" ON "survey_interventions"("survey_id");

-- CreateIndex
CREATE INDEX "surveys_village_id_idx" ON "surveys"("village_id");

-- CreateIndex
CREATE INDEX "surveys_survey_date_idx" ON "surveys"("survey_date");

-- CreateIndex
CREATE INDEX "surveys_surveyor_name_idx" ON "surveys"("surveyor_name");

-- CreateIndex
CREATE INDEX "surveys_house_owner_idx" ON "surveys"("house_owner");

-- CreateIndex
CREATE INDEX "villages_health_center_id_idx" ON "villages"("health_center_id");
