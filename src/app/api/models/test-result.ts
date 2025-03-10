import { Association, CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, ModelStatic } from "sequelize";
import { ID } from "../utils/shared-types";
import { sequelize } from "../initialisers";
import { isPresent } from "../utils/object-helpers";
import { User } from "./user";
import { TestVenue } from "./test-venue";

class TestResult extends Model<InferAttributes<TestResult>, InferCreationAttributes<TestResult>> {
  declare id: CreationOptional<ID>;
  declare userId: ForeignKey<User['id']>;
  declare testVenueId: ForeignKey<TestVenue['id']>;
  declare testScore: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare static associations: {
    user: Association<TestResult, User>;
    word: Association<TestResult, TestVenue>;
  };

  static associate(models: { [key: string]: ModelStatic<Model> }) {
    models['TestResult'].belongsTo(models['User'], {
      foreignKey: 'userId',
      constraints: false,
      as: 'user',
    });

    models['TestResult'].belongsTo(models['TestVenue'], {
      foreignKey: 'testVenueId',
      constraints: false,
      as: 'testVenue',
    });
  }
}

TestResult.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    testScore: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'testResult',
    tableName: 'testResults',
    validate: {
      async validateRequiredFields() {
        if (!isPresent(this.userId)) throw new Error('수험자는 필수입니다.');
        if (!isPresent(this.testVenueId)) throw new Error('테스트 장소는 필수입니다.');
      },
    },
  },
);

export { TestResult };