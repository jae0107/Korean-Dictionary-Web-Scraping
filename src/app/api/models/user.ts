import { CreationOptional, DataTypes, DestroyOptions, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, ModelStatic, Op } from "sequelize";
import { ID } from "../utils/shared-types";
import { sequelize } from "../initialisers";
import { isPresent } from "../utils/object-helpers";
import { Word } from "./word";
import * as bcrypt from 'bcrypt';
import { MyVocabulary } from ".";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<ID>;
  declare name: string;
  declare email?: string;
  declare accountId: string;
  declare password: string;
  declare role: string;
  declare status: string;
  declare previousStatus?: string;
  declare year?: CreationOptional<number>;
  declare class?: CreationOptional<string>;
  declare number?: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare accessToken?: string;

  declare words?: Word[];
  declare getWords: HasManyGetAssociationsMixin<Word>;
  declare setWords: HasManySetAssociationsMixin<Word, number>;
  declare removeWords: HasManyRemoveAssociationsMixin<Word, number>;
  declare countWords: HasManyCountAssociationsMixin;

  static associate(models: { [key: string]: ModelStatic<Model> }) {
    models['User'].hasMany(models['Word'], {
      foreignKey: 'requestorId',
      constraints: false,
    });
  }

  async checkAccountIdUnique(accountId: string): Promise<boolean> {
    const existingAccount = await User.count({ where: { accountId: accountId } });
    return existingAccount === 0;
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    accountId: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM('ADMIN', 'STUDENT', 'TEACHER'),
    status: DataTypes.ENUM('APPROVED', 'DENIED', 'PENDING'),
    previousStatus: DataTypes.ENUM('APPROVED', 'DENIED', 'PENDING'),
    year: DataTypes.INTEGER,
    class: DataTypes.STRING,
    number: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    accessToken: DataTypes.VIRTUAL,
  },
  {
    sequelize,
    modelName: 'user',
    tableName: 'users',
    validate: {
      async validateRequiredFields() {
        if (!isPresent(this.name)) throw new Error('이름을 입력해주세요.');
        if (!isPresent(this.accountId)) throw new Error('아이디를 입력해주세요.');
        if (!isPresent(this.password)) throw new Error('비밀번호를 입력해주세요.');
        if (!isPresent(this.role)) throw new Error('역할은 필수입니다.');
        if (!isPresent(this.status)) throw new Error('상태는 필수입니다.');
        if (!/^[a-zA-Z0-9_]+$/.test(this.accountId as string)) {
          throw new Error('아이디는 영문, 숫자, 밑줄(_)만 사용할 수 있습니다.');
        }
        if ((this.password as string).length < 8) {
          throw new Error('패스워드는 8자 이상이어야 합니다.');
        }
        if (!/[A-Z]/.test(this.password as string)) {
          throw new Error('패스워드에 최소 하나의 대문자가 포함되어야 합니다.');
        }
        if (!/[a-z]/.test(this.password as string)) {
          throw new Error('패스워드에 최소 하나의 소문자가 포함되어야 합니다.');
        }
        if (!/[0-9]/.test(this.password as string)) {
          throw new Error('패스워드에 최소 하나의 숫자가 포함되어야 합니다.');
        }
        if (!/[\W_]/.test(this.password as string)) {
          throw new Error('패스워드에 최소 하나의 특수문자 (!@#$%^&*)가 포함되어야 합니다.');
        }
      },
      async validateUniqueAccountId() {
        const existingUserCount = await User.count({ where: { accountId: this.accountId as string } });
        if (existingUserCount > 1) {
          throw new Error('아이디는 고유해야 합니다.');
        }
      }
    },
  },
);

User.addHook('beforeValidate', 'defaultValues', (user: User) => {
  if (user.isNewRecord) {
    user.status = user.status || 'PENDING';
  }
});

User.addHook('beforeSave', 'hashPassword', async (user: User) => {
  user.password = await bcrypt.hash(user.password, 10);
});

User.addHook('beforeBulkCreate', 'bulkHashPassword', async (users: User[]) => {
  for (const user of users) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.addHook('beforeDestroy', 'delete my vocabularies', async (user: User) => {
  await MyVocabulary.destroy({
    where: {
      userId: user.id,
    },
  });
});

User.addHook('beforeBulkDestroy', 'bulk delete my vocabularies', async (options: DestroyOptions<InferAttributes<User>>) => {
  const users = await User.findAll({ where: options.where });
  await MyVocabulary.destroy({
    where: {
      userId: {
        [Op.in]: users.map(user => user.id),
      },
    },
  });
});

export { User };