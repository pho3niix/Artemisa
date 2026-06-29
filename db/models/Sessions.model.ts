import { Model, DataTypes, InferAttributes, InferCreationAttributes, ForeignKey, literal } from 'sequelize';
import { Database } from '../db';

/**@Associations */
import Users from './User.model';

export interface ISessions {
    SessionId: string;
    Token: string;
    OwnerUserId: ForeignKey<Users['UserId']>;
    ExpiresAt: Date;
    UpdatedAt: Date;
    CreatedAt: Date;
}

class Sessions extends Model<InferAttributes<Sessions>, InferCreationAttributes<Sessions>>{
    declare SessionId: string;
    declare Token: string;
    declare OwnerUserId: ForeignKey<Users['UserId']>;
    declare ExpiresAt: Date;
    declare UpdatedAt: Date;
    declare CreatedAt: Date;
}

Sessions.init(
    {
        SessionId: {
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
        Token: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        ExpiresAt: {
            type: DataTypes.DATE,
            defaultValue: literal('CURRENT_TIMESTAMP')
        },
        OwnerUserId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        CreatedAt: {
            type: DataTypes.DATE,
            defaultValue: Database.literal('CURRENT_TIMESTAMP')
        },
        UpdatedAt: {
            type: DataTypes.DATE,
            defaultValue: Database.literal('CURRENT_TIMESTAMP')

        }
    },
    {
        tableName: 'Sessions',
        indexes: [
            {
                unique: true,
                fields: ['SessionId']
            },
        ],
        createdAt: "CreatedAt",
        updatedAt: "UpdatedAt",
        sequelize: Database
    }
);

export default Sessions;