import { Association, BelongsToGetAssociationMixin, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelStatic } from "sequelize";
import { ID } from "../utils/shared-types";
import { User } from "./user";
import { sequelize } from "../initialisers";
import { isPresent } from "../utils/object-helpers";
import { Word } from "./word";

class MyVocabulary extends Model<InferAttributes<MyVocabulary>, InferCreationAttributes<MyVocabulary>> {
  declare id: CreationOptional<ID>;
  declare userId: ID;
  declare wordId: ID;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare user?: User;
  declare getUser: BelongsToGetAssociationMixin<User>;

  declare word?: Word;
  declare getWord: BelongsToGetAssociationMixin<Word>;

  declare static associations: {
    user: Association<MyVocabulary, User>;
    word: Association<MyVocabulary, Word>;
  };

  static associate(models: { [key: string]: ModelStatic<Model> }) {
    models['MyVocabulary'].belongsTo(models['User'], {
      foreignKey: 'userId',
      constraints: false,
      as: 'user',
    });

    models['MyVocabulary'].belongsTo(models['Word'], {
      foreignKey: 'wordId',
      constraints: false,
      as: 'word',
    });
  }
}

MyVocabulary.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: DataTypes.UUID,
    wordId: DataTypes.UUID,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'myVocabulary',
    tableName: 'myVocabularies',
    validate: {
      async validateRequiredFields() {
        if (!isPresent(this.userId)) throw new Error('요청자는 필수입니다.');
        if (!isPresent(this.wordId)) throw new Error('단어는 필수입니다.');
      },
    },
  },
);

export { MyVocabulary };