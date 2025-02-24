import { Association, BelongsToGetAssociationMixin, CreationOptional, DataTypes, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, ModelStatic } from "sequelize";
import { ID } from "../utils/shared-types";
import { sequelize } from "../initialisers";
import { isPresent } from "../utils/object-helpers";
import { User } from "./user";
import { WordStatus } from "@/app/generated/gql/graphql";

class Word extends Model<InferAttributes<Word>, InferCreationAttributes<Word>> {
  declare id: CreationOptional<ID>;
  declare title: string;
  declare korDicResults?: string[];
  declare naverDicResults?: string[];
  declare requestorId: ID;
  declare status: string;
  declare previousStatus?: string;
  declare page?: number;
  declare example?: string;
  declare deniedReason?: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare requestor?: User;
  declare getRequestor: BelongsToGetAssociationMixin<User>;

  declare static associations: {
    requestor: Association<Word, User>;
  };

  static associate(models: { [key: string]: ModelStatic<Model> }) {
    models['Word'].belongsTo(models['User'], {
      foreignKey: 'requestorId',
      constraints: false,
      as: 'requestor',
    });
  }
}

Word.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    korDicResults: DataTypes.ARRAY(DataTypes.STRING),
    naverDicResults: DataTypes.ARRAY(DataTypes.STRING),
    requestorId: DataTypes.UUID,
    status: DataTypes.ENUM('APPROVED', 'DENIED', 'PENDING'),
    previousStatus: DataTypes.ENUM('APPROVED', 'DENIED', 'PENDING'),
    page: DataTypes.INTEGER,
    example: DataTypes.STRING,
    deniedReason: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'word',
    tableName: 'words',
    validate: {
      async validateRequiredFields() {
        if (!isPresent(this.title)) throw new Error('단어를 입력해주세요.');
        if (!isPresent(this.requestorId)) throw new Error('요청자는 필수입니다.');
        if (!isPresent(this.status)) throw new Error('상태는 필수입니다.');
        if (!isPresent(this.korDicResults) && !isPresent(this.naverDicResults)) throw new Error('국립국어원 사전 또는 네이버 사전 결과 중 하나는 필수입니다.');
      },
    },
  },
);

Word.addHook('beforeValidate', 'defaultValues', (word: Word) => {
  if (word.isNewRecord) {
    word.status = word.status || WordStatus.Pending;
  }
});

export { Word };