const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

//create our user model
class User extends Model {
    //set up method to run on instance data (per user) to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

//define table columns and configuration
User.init(
    {
        //TABLE COLUMN DEFINITIONS GO HERE
        //define id column
        id: {
            //use the special sequelize DataTypes object provide what type of data it is
            type: DataTypes.INTEGER,
            // this is equivalent of SQls 'not null' option
            allowNull: false,
            //instruct that its a primary key
            primaryKey: true,
            //turn on auto increment
            autoIncrement: true
        },
        //define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            //we cant have duplicate emails
            unique: true,
            //if allowNull is set to false, we can run our data through a validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        //define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //this means the password must be at least 4 characters long
                len: [4]
            }
        }
    },
    {
        hooks: {
            //set up beforeCreate lifecycle "hook" functionality
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            //set up beforeCreate lifecycle "hook" functionality
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData
            }
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user'
    },
    {
        //table configuration options go here (https://sequelize.org/v5/manual/models-definition.html#configuration))

        //pass in our imported sequelize connection(the direct connection to our database)
        sequelize,
        // dont automatically create createdAT/updatedAT timestamp fields
        timestamps: false,
        //dont pluralize name of database table
        freezeTableName: true,
        //use underscores instead of camel-casing (i.e  `comment_text` and not `commentText)
        underscored: true,
        //make it so our model name stays lowercase in the database
        modelName: 'user'
    },
);

module.exports = User;