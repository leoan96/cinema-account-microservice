import { VAULT_CLIENT } from 'src/hashicorp-vault/vault.provider';

export const MongooseClient = {
  useFactory: async (vault) => ({
    uri: vault.MONGO_DATABASE_URI,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    createIndexes: false,
  }),
  inject: [VAULT_CLIENT],
};
