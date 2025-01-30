import { Transaction, TransactionOptions } from 'sequelize';
import { sequelize } from '../initialisers';

export async function transaction<T>(
  cb: (t: Transaction) => PromiseLike<T>,
  transactionOptions: TransactionOptions = {
    isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  },
): Promise<T> {
  let retries = 3;

  while (true) {
    try {
      return await sequelize.transaction(transactionOptions, cb);
    } catch (e) {
      if (retries-- <= 0) {
        throw e;
      }
    }
  }
}
