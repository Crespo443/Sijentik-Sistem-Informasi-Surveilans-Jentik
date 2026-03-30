-- CreateEnum
CREATE TYPE "AccessCodeType" AS ENUM ('ADMIN', 'PKM_UNIT');

-- CreateEnum
CREATE TYPE "SurveyStatus" AS ENUM ('DRAFT', 'SUBMITTED');

-- CreateEnum
CREATE TYPE "ContainerCategory" AS ENUM ('DAILY', 'NON_DAILY', 'NATURAL');

-- CreateTable
CREATE TABLE "districts" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "head_name" TEXT,
    "phone_number" TEXT,
    "address" TEXT,
    "area_size" DECIMAL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_centers" (
    "id" UUID NOT NULL,
    "district_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "head_name" TEXT,
    "phone_number" TEXT,
    "address" TEXT,
    "target_houses" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "health_centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "villages" (
    "id" UUID NOT NULL,
    "district_id" UUID NOT NULL,
    "health_center_id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "villages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_codes" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "type" "AccessCodeType" NOT NULL,
    "health_center_id" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "access_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surveys" (
    "id" UUID NOT NULL,
    "surveyor_name" TEXT NOT NULL,
    "access_code_id" UUID NOT NULL,
    "village_id" UUID NOT NULL,
    "survey_date" DATE NOT NULL,
    "house_owner" TEXT NOT NULL,
    "rt_rw" TEXT,
    "address" TEXT,
    "occupant_count" INTEGER,
    "latitude" DECIMAL,
    "longitude" DECIMAL,
    "status" "SurveyStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "surveys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_containers" (
    "id" UUID NOT NULL,
    "survey_id" UUID NOT NULL,
    "category" "ContainerCategory" NOT NULL,
    "container_name" TEXT NOT NULL,
    "inspected_count" INTEGER NOT NULL DEFAULT 0,
    "positive_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "survey_containers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_interventions" (
    "id" UUID NOT NULL,
    "survey_id" UUID NOT NULL,
    "activity_name" TEXT NOT NULL,
    "is_done" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "survey_interventions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "districts_name_key" ON "districts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "access_codes_code_key" ON "access_codes"("code");

-- AddForeignKey
ALTER TABLE "health_centers" ADD CONSTRAINT "health_centers_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "villages" ADD CONSTRAINT "villages_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "villages" ADD CONSTRAINT "villages_health_center_id_fkey" FOREIGN KEY ("health_center_id") REFERENCES "health_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_codes" ADD CONSTRAINT "access_codes_health_center_id_fkey" FOREIGN KEY ("health_center_id") REFERENCES "health_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "surveys_access_code_id_fkey" FOREIGN KEY ("access_code_id") REFERENCES "access_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "surveys_village_id_fkey" FOREIGN KEY ("village_id") REFERENCES "villages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_containers" ADD CONSTRAINT "survey_containers_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_interventions" ADD CONSTRAINT "survey_interventions_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
