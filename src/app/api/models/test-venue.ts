import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelStatic } from "sequelize";
import { ID } from "../utils/shared-types";
import { sequelize } from "../initialisers";
import { isPresent } from "../utils/object-helpers";

class TestVenue extends Model<InferAttributes<TestVenue>, InferCreationAttributes<TestVenue>> {
  declare id: CreationOptional<ID>;
  declare title: CreationOptional<string>;
  declare year: number;
  declare class: string;
  declare status: string;
  declare previousStatus: CreationOptional<string>;
  declare pageFrom: CreationOptional<number>;
  declare pageTo: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare static associations: {};

  static associate(models: { [key: string]: ModelStatic<Model> }) {}
}

TestVenue.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    year: DataTypes.INTEGER,
    class: DataTypes.STRING,
    pageFrom: DataTypes.INTEGER,
    pageTo: DataTypes.INTEGER,
    status: DataTypes.STRING,
    previousStatus: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'testVenue',
    tableName: 'testVenues',
    validate: {
      async validateRequiredFields() {
        if (!isPresent(this.year)) throw new Error('학년은 필수입니다.');
        if (!isPresent(this.class)) throw new Error('반은 필수입니다.');
        if (!isPresent(this.pageFrom) && isPresent(this.pageTo)) {
          throw new Error('시작 페이지가 빈 경우 끝 페이지도 빈 경우여야 합니다.');
        }
        if (isPresent(this.pageFrom) && !isPresent(this.pageTo)) {
          throw new Error('끝 페이지가 빈 경우 시작 페이지도 빈 경우여야 합니다.');
        }
      },
    },
  },
);

TestVenue.addHook('beforeCreate', 'setTitle', async (testVenue: TestVenue) => {
  if (!testVenue.year || !testVenue.class) {
    throw new Error('Year and class are required to generate a title');
  }

  // Get the count of existing test venues for the same year and class
  const count = await TestVenue.count({
    where: {
      year: testVenue.year,
      class: testVenue.class,
    },
  });

  // Generate the title (1차, 2차, 3차...)
  testVenue.title = `${count + 1}차`;
});

export { TestVenue };