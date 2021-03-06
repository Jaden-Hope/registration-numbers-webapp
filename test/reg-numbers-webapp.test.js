const assert = require('assert');
const { Pool } = require('pg');
const Factory = require('../regFactory');

const connectionString = 'postgres://muzzaujaysjazq:69196cbdb92a6efe12591b4da277cf9e2f185639fac870a60509cb6db5bfe4e4@ec2-34-249-247-7.eu-west-1.compute.amazonaws.com:5432/ded39ads80c6bl';

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});

const factory = Factory(pool);

describe('Tests:', () => {
    describe('Database tests:', () => {
        beforeEach(async () => {
            await factory.reset();
        });

        it('Should be able to insert a new entry with addRegToDB function', async () => {
            await factory.addRegToDB('CY 12345');
            assert.equal(await (await factory.selectAllReg()).rowCount, 1);
        });

        it('Should be able to update an entry', async () => {
            await factory.addRegToDB('CY 12345');
            await pool.query("UPDATE registration SET registration_number = 'CY 54321' WHERE registration_number = 'CY 12345'");
            const entry = await (await factory.selectAllReg()).rows;
            assert.equal(entry[0].registration_number, ['CY 54321']);
        });

        after(async () => {
            await factory.reset();
        });
    });

    describe('Factory Function tests:', () => {
        beforeEach(async () => {
            await factory.reset();
        });

        it('checkForExisting function should find existing entry for registration "CY 12345"', async () => {
            await factory.addRegToDB('CY 12345');
            assert.equal(await factory.checkForExisting('CY 12345'), true);
        });

        it('checkForExisting function should not find an existing entry for registration "CA 54321"', async () => {
            await factory.addRegToDB('CY 12345');
            assert.equal(await factory.checkForExisting('CA 54321'), false);
        });

        it('filterRegList function should only display CY reg numbers', async () => {
            await factory.addRegToDB('CY 12345');
            await factory.addRegToDB('CA 54321');
            await factory.addRegToDB('CK 12543');

            assert.deepEqual(await factory.filterRegListWithNum('CY'), ['CY 12345']);
        });

        it('filterRegList function should only display CA reg numbers', async () => {
            await factory.addRegToDB('CY 12345');
            await factory.addRegToDB('CA 54321');
            await factory.addRegToDB('CK 12543');

            assert.deepEqual(await factory.filterRegListWithNum('CA'), ['CA 54321']);
        });

        it('filterRegList function should only display CK reg numbers', async () => {
            await factory.addRegToDB('CY 12345');
            await factory.addRegToDB('CA 54321');
            await factory.addRegToDB('CK 12543');

            assert.deepEqual(await factory.filterRegListWithNum('CK'), ['CK 12543']);
        });

        it('filterRegList should return registration numbers "CY 12345", "CA 54321" and "CK 12543"', async () => {
            await factory.addRegToDB('CY 12345');
            await factory.addRegToDB('CA 54321');
            await factory.addRegToDB('CK 12543');

            assert.deepEqual(await factory.filterRegList(), ['CY 12345', 'CA 54321', 'CK 12543']);
        });
    });
    after(async () => {
        await factory.reset();
        pool.end();
    });
});
