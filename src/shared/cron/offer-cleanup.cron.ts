import cron from "node-cron";
import { container } from "tsyringe";
import { DeleteExpiredOffersUseCase } from "../../useCases/offer/delete-expired-offers.usecase";

export const startOfferCleanupJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log(`[CRON] ${new Date().toISOString()} - Running offer cleanup...`);

    const useCase = container.resolve(DeleteExpiredOffersUseCase);
    try {
      const result = await useCase.execute();
      console.log(`[CRON] Deleted ${result.deletedCount} expired offers.`);
    } catch (err) {
      console.error("[CRON] Failed to delete expired offers:", err);
    }
  });
};

