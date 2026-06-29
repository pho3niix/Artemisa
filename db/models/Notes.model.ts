import { Model, DataTypes, InferAttributes, InferCreationAttributes, ForeignKey } from 'sequelize';
import { Database } from '../db';

export interface INotes {
    NoteId?: string;
    // UserId: string;
    Title: string;
    Description: string;
    // IsActive?: string;
    IsDone: boolean;
    CreatedAt?: Date;
    UpdatedAt?: Date;
}

class Notes extends Model<InferAttributes<Notes>, InferCreationAttributes<Notes>>{
    declare NoteId: string;
    // // declare UserId: ForeignKey<Users['UserId']>;
    declare Title: string;
    declare Description: string;
    // declare IsActive: string;
    declare CreatedAt: Date;
    declare UpdatedAt: Date;
    declare IsDone: boolean;
}

Notes.init(
    {
        NoteId: {
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
        // UserId: {
        //     type: DataTypes.UUID,
        //     allowNull: true,
        //     validate: {
        //         isUUID: {
        //             args: 4,
        //             msg: 'Please, input an UUID value for User id.'
        //         }
        //     }
        // },
        Title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please, input a title for note.'
                },
                notEmpty: {
                    msg: 'Please, input a correct title. Make sure that length is no longer than 60 characters.'
                }
            }
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please, input a correct description. Make sure that length is no longer than 255 characters.'
                },
                notNull: {
                    msg: 'Please, input a description for note.'
                },
            }
        },
        // IsActive: {
        //     type: DataTypes.BOOLEAN,
        //     allowNull: false,
        //     defaultValue: true
        // },
        CreatedAt: {
            type: DataTypes.DATE,
            defaultValue: Database.literal('CURRENT_TIMESTAMP')
        },
        UpdatedAt: {
            type: DataTypes.DATE,
            defaultValue: Database.literal('CURRENT_TIMESTAMP')

        },
        IsDone: {
            type:DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        tableName: 'Notes',
        indexes: [
            {
                unique: true,
                fields: ['NoteId']
            }
        ],
        createdAt: "CreatedAt",
        updatedAt: "UpdatedAt",
        sequelize: Database
    },
);

export default Notes;