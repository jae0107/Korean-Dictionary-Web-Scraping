import { CreationOptional, DataTypes, DestroyOptions, InferAttributes, InferCreationAttributes, Model, ModelStatic, Op } from "sequelize";
import { ID } from "../utils/shared-types";
import { sequelize } from "../initialisers";
import { isPresent } from "../utils/object-helpers";
import { WordStatus } from "@/app/generated/gql/graphql";
import { MyVocabulary } from "./my-vocabulary";

class Word extends Model<InferAttributes<Word>, InferCreationAttributes<Word>> {
  declare id: CreationOptional<ID>;
  declare title: string;
  declare korDicResults?: string[];
  declare naverDicResults?: string[];
  declare requestorIds: ID[];
  declare status: string;
  declare previousStatus?: string;
  declare pages?: number[];
  declare example?: string;
  declare deniedReason?: string;
  declare wordId?: ID;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare static associations: {};

  static associate(models: { [key: string]: ModelStatic<Model> }) {}
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
    requestorIds: DataTypes.ARRAY(DataTypes.UUID),
    status: DataTypes.ENUM('APPROVED', 'DENIED', 'PENDING'),
    previousStatus: {
      type: DataTypes.ENUM('APPROVED', 'DENIED', 'PENDING'),
      allowNull: true,
    },
    pages: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    },
    example: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deniedReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    wordId: {
      type: DataTypes.UUID,
      allowNull: true,
    },    
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
        if (!isPresent(this.requestorIds)) throw new Error('요청자는 필수입니다.');
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

Word.addHook('beforeDestroy', 'delete my vocabularies', async (word: Word) => {
  await MyVocabulary.destroy({
    where: {
      wordId: word.id,
    },
  });

  const duplicatedWord = await Word.findOne({ where: { wordId: word.id } });
  duplicatedWord && await duplicatedWord.update({ status: WordStatus.Pending, previousStatus: duplicatedWord.status, wordId: sequelize.literal('NULL') });
});

Word.addHook('beforeBulkDestroy', 'bulk delete my vocabularies', async (options: DestroyOptions<InferAttributes<Word>>) => {
  const words = await Word.findAll({ where: options.where });
  const ids = words.map(word => word.id);

  await MyVocabulary.destroy({
    where: {
      wordId: {
        [Op.in]: ids,
      },
    },
  });

  await Word.update(
    {
      status: WordStatus.Pending,
      previousStatus: sequelize.literal('status'),
      wordId: sequelize.literal('NULL'),
    },
    {
      where: {
        wordId: {
          [Op.in]: ids,
        },
      },
      validate: false,
    }
  );
});

export { Word };