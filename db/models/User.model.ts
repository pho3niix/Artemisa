import { Model, DataTypes, InferAttributes, InferCreationAttributes, ForeignKey } from 'sequelize';
import { Database } from '../db';

export interface IUsers {
    UserId?: string;
    Name?: string;
    LastName?: string;
    Email?: string;
    Password?: string;
    CreatedAt?: Date;
    UpdatedAt?: Date;
    FullName?: string;
    IsActive?: boolean;
    HasAccess?: boolean;
}

class Users extends Model<InferAttributes<Users>, InferCreationAttributes<Users>>{
    declare UserId: string;
    declare Name: string;
    declare LastName: string;
    declare Email: string;
    declare Password: string;
    declare CreatedAt: Date;
    declare UpdatedAt: Date;
    declare FullName: string;
    declare IsActive: boolean;
    declare HasAccess: boolean;
}

Users.init(
    {
        UserId: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            validate: {
                isUUID: {
                    args: 4,
                    msg: 'Please, input an UUID value for Note id.'
                }
            }
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please, input your full name to continue.'
                },
                notEmpty: {
                    msg: 'Please, input your full name. Make sure that length is no longer than 60 characters.'
                }
            }
        },
        LastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please, input your full name to continue.'
                },
                notEmpty: {
                    msg: 'Please, input your full name. Make sure that length is no longer than 60 characters.'
                }
            }
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: 'Please, input a correct email. Make sure that length is no longer than 255 characters.'
                },
                notNull: {
                    msg: 'Please, input a valid email to continue.'
                },
            }
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please, input a correct password. Make sure that length is no longer than 255 characters.'
                },
                notNull: {
                    msg: 'Please, input a password to continue.'
                },
            }
        },
        IsActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        HasAccess: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        CreatedAt: {
            type: DataTypes.DATE,
            defaultValue: Database.literal('CURRENT_TIMESTAMP')
        },
        UpdatedAt: {
            type: DataTypes.DATE,
            defaultValue: Database.literal('CURRENT_TIMESTAMP')

        },
        FullName: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.Name} ${this.LastName}`
            },
        }
    },
    {
        tableName: 'Users',
        indexes: [
            {
                unique: true,
                fields: ['Email']
            }
        ],
        createdAt: "CreatedAt",
        updatedAt: "UpdatedAt",
        sequelize: Database
    },
);

export default Users;