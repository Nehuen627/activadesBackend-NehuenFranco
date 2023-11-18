import mongoose from 'mongoose';

const cartsSchema = new mongoose.Schema({
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products', 
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
}, {
    timestamps: true
});

cartsSchema.pre('findOne', function() {
    this.populate('products.productId');
});

export default mongoose.model('Carts', cartsSchema);
