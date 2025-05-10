const { db } = require('../config/firebase');

// Get User by ID
const getUserById = async (req, res) => {
    const { uid } = req.params;

    try {
        const userDoc = await db.collection('User').doc(uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userData = userDoc.data();
        res.status(200).json({ success: true, user: userData });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Edit User
const editUser = async (req, res) => {
    const { uid } = req.params;
    const { firstName, lastName, email, birthDate, gender, role, user_image } = req.body;

    try {
        const userDoc = db.collection('User').doc(uid);
        const userSnapshot = await userDoc.get();

        if (!userSnapshot.exists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const updatedData = {
            First_name: firstName,
            Last_name: lastName,
            Email: email,
            Birthdate: birthDate ? new Date(birthDate) : undefined,
            Gender: gender,
            Role: role,
            user_image: user_image,
            Updated_at: new Date(),
        };

        // Remove undefined fields
        Object.keys(updatedData).forEach(key => {
            if (updatedData[key] === undefined) {
                delete updatedData[key];
            }
        });

        await userDoc.update(updatedData);

        res.status(200).json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { editUser, getUserById };