
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User'); // mongoose user model

// // ==================== GET all users ====================
// // List all users with suspend info
// router.get('/', async (req, res) => {
//     try {
//         const users = await User.find({}, "name email role status suspendReason suspendFeedback");
//         res.json(users);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });

// // ==================== GET user by UID ====================
// // Fetch single user by uid → useful for frontend check
// // router.get('/uid/:uid', async (req, res) => {
// //     try {
// //         const user = await User.findOne(
// //             { uid: req.params.uid },
// //             "name email role status suspendReason suspendFeedback"
// //         );
// //         if (!user) return res.status(404).json({ message: "User not found" });
// //         res.json(user);
// //     } catch (err) {
// //         console.error(err);
// //         res.status(500).json({ message: "Server error" });
// //     }
// // });
// router.get('/uid/:uid', async (req, res) => {
//     try {
//         const uid = req.params.uid;

//         // 1️⃣ Try finding by uid
//         let user = await User.findOne(
//             { uid },
//             "uid name email role status suspendReason suspendFeedback"
//         );

//         // 2️⃣ If not found → try email (Google login fallback)
//         if (!user && req.query.email) {
//             user = await User.findOne(
//                 { email: req.query.email },
//                 "uid name email role status suspendReason suspendFeedback"
//             );
//         }

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.json(user);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// });



// // ==================== PATCH /users/:id ====================
// // Update role, status, suspend reason & feedback
// router.patch('/:id', async (req, res) => {
//     try {
//         const { role, status, suspendReason, suspendFeedback } = req.body;

//         const updatedUser = await User.findByIdAndUpdate(
//             req.params.id,
//             { role, status, suspendReason, suspendFeedback },
//             { new: true } // return updated document
//         );

//         res.json(updatedUser);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ================= GET all users =================
router.get('/', async (req, res) => {
    try {
        const users = await User.find(
            {},
            "uid name email role status suspendReason suspendFeedback"
        );
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// ================= GET user by UID (email fallback) =================
router.get('/uid/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const { email } = req.query;

        let user = await User.findOne({ uid });

        if (!user && email) {
            user = await User.findOne({ email });
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// ================= Update suspend / role =================
router.patch('/:id', async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
