import { CreationOptional, DataTypes, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, ModelStatic } from "sequelize";
import { ID } from "../utils/shared-types";
import { sequelize } from "../initialisers";
import { isPresent } from "../utils/object-helpers";
import { Word } from "./word";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<ID>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: string;
  declare status: string;
  declare year?: CreationOptional<number>;
  declare class?: CreationOptional<string>;
  declare number?: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

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
    password: DataTypes.STRING,
    role: DataTypes.ENUM('ADMIN', 'STUDENT', 'TEACHER'),
    status: DataTypes.ENUM('APPROVED', 'DENIED', 'PENDING'),
    year: DataTypes.INTEGER,
    class: DataTypes.STRING,
    number: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'user',
    tableName: 'users',
    validate: {
      async validateRequiredFields() {
        if (!isPresent(this.name)) throw new Error('Name is required.');
        if (!isPresent(this.email)) throw new Error('Email is required.');
        if (!isPresent(this.password)) throw new Error('Password is required.');
        if (!isPresent(this.role)) throw new Error('Role is required.');
        if (!isPresent(this.status)) throw new Error('Status is required.');
      },
    },
  },
);

User.addHook('beforeValidate', 'defaultValues', (user: User) => {
  if (user.isNewRecord) {
    user.status = user.status || 'PENDING';
  }
});

export { User };