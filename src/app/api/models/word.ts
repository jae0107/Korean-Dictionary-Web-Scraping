import { Association, BelongsToGetAssociationMixin, CreationOptional, DataTypes, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, ModelStatic } from "sequelize";
import { ID } from "../utils/shared-types";
import { sequelize } from "../initialisers";
import { isPresent } from "../utils/object-helpers";
import { User } from "./user";

class Word extends Model<InferAttributes<Word>, InferCreationAttributes<Word>> {
  declare id: CreationOptional<ID>;
  declare title: string;
  declare korDicResults: string[];
  declare naverDicResults: string[];
  declare requestorId: ID;
  declare status: string;
  declare page: number;
  declare example: string;
  declare deniedReason: string;
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
        if (!isPresent(this.title)) throw new Error('Title is required.');
        if (!isPresent(this.email)) throw new Error('Email is required.');
        if (!isPresent(this.requestorId)) throw new Error('Requestor ID is required.');
        if (!isPresent(this.status)) throw new Error('Status is required.');
      },
    },
  },
);

Word.addHook('beforeValidate', 'defaultValues', (word: Word) => {
  if (word.isNewRecord) {
    word.status = word.status || 'PENDING';
  }
});

export { Word };