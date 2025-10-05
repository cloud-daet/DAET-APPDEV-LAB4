// Arrays to hold data
let materials = [ // Array to hold materials
  { name: "Detergent", qty: 20, price: 15 },
  { name: "Fabric Conditioner", qty: 20, price: 5 },
  { name: "Laundry Bag", qty: 20, price: 5 },
];
let cleanLaundry = []; // Array to hold clean laundry
let uncleanLaundry = []; // Array to hold unclean laundry

// Maximum weight limit for laundry in kg
const MAX_WEIGHT = 7;

// Display Materials in Table
function displayMaterials() {
    console.log("Materials:");
    console.table(materials);
}

// Add New Material
function addMaterial(name, qty, price) {
    let newMaterial = {
        name: name,
        qty: qty,
        price: price
    };
    materials.push(newMaterial);
    console.log(`Added new material: ${name}, Quantity: ${qty}, Price: $${price}`);
}

// Add to exsisting Material
function addToMaterial(name, additionalQty) {
    let material = materials.find(m => m.name === name);
    if (material) {
        material.qty += additionalQty;
        console.log(`Updated ${name} quantity to +${additionalQty}`);
    } else {
        console.log(`Material ${name} not found.`);
    }  
}
// Add New Laundry
function addLaundry(clientName, totalKg) {
    let bags = Math.ceil(totalKg / MAX_WEIGHT); // round up any remainder
    uncleanLaundry.push({ clientName, qty: bags, status: "Pending" });
    console.log(`${clientName}'s laundry (${bags} bag/s) added.`);
}

// Update Material Quantity
function updateMaterialQty(name, newQty) {
  let material = materials.find(m => m.name === name);
  if (material) {
    material.qty = newQty;
    console.log(`${name} stock updated to ${newQty}.`);
  } else {
    console.log(`Material ${name} not found.`);
  }
}