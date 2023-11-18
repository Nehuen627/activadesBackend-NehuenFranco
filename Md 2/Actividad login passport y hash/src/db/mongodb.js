import mongoose from 'mongoose';

export const init = async () => {
    try {
        await mongoose.connect(process.env.URI);
        console.log('Database conected');
    } catch (error) {
        console.log('Ah ocurrido un error al intentar conectarnos a la DB', error.message);
    }
}