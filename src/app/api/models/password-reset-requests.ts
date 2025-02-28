import { Association, BelongsToGetAssociationMixin, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelStatic } from "sequelize";
import { ID } from "../utils/shared-types";
import { User } from "./user";
import { sequelize } from "../initialisers";
import { isPresent } from "../utils/object-helpers";

class PasswordResetRequest extends Model<InferAttributes<PasswordResetRequest>, InferCreationAttributes<PasswordResetRequest>> {
  declare id: CreationOptional<ID>;
  declare requestorId: ID;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare requestor?: User;
  declare getRequestor: BelongsToGetAssociationMixin<User>;

  declare static associations: {
    requestor: Association<PasswordResetRequest, User>;
  };

  static associate(models: { [key: string]: ModelStatic<Model> }) {
    models['PasswordResetRequest'].belongsTo(models['User'], {
      foreignKey: 'requestorId',
      constraints: false,
      as: 'requestor',
    });
  }
}

PasswordResetRequest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    requestorId: DataTypes.UUID,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'passwordResetRequest',
    tableName: 'passwordResetRequests',
    validate: {
      async validateRequiredFields() {
        if (!isPresent(this.requestorId)) throw new Error('요청자는 필수입니다.');
      },
    },
  },
);

export { PasswordResetRequest };