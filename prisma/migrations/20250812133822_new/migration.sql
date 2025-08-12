/*
  Warnings:

  - A unique constraint covering the columns `[symbol,date]` on the table `StockPrice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StockPrice_symbol_date_key" ON "public"."StockPrice"("symbol", "date");
