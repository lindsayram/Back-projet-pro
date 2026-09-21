// Import connection to DB
const { pool } = require('../config/database')

// Create a set
// const querytrigger = 
// `CREATE A FUNCTION auto_increment() RETURNS trigger as $auto_increment$
//     BEFORE INSERT ON "Sets"
//     FOR EACH ROW
//     BEGIN
//          SELECT COALESCE(MAX(order_set), 0) + 1
//          INTO NEW.order_set
//          FROM "Sets" 
//          WHERE fk_id_training = NEW.fk_id_training
//     END
// $$ LANGUAGE plpgsql
// `
// Update a set

// Display sets

// Delete sets