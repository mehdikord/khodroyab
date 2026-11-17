-- CreateIndex
CREATE INDEX `brands_name_idx` ON `brands`(`name`);

-- CreateIndex
CREATE INDEX `brands_is_active_idx` ON `brands`(`is_active`);

-- CreateIndex
CREATE INDEX `brands_created_at_idx` ON `brands`(`created_at`);

-- CreateIndex
CREATE INDEX `cars_brand_id_name_idx` ON `cars`(`brand_id`, `name`);

-- CreateIndex
CREATE INDEX `cars_name_idx` ON `cars`(`name`);

-- CreateIndex
CREATE INDEX `cars_price_table_idx` ON `cars`(`price_table`);

-- CreateIndex
CREATE INDEX `cars_created_at_idx` ON `cars`(`created_at`);

