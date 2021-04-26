"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Router } = require('express');
const router = Router();
router.get('/', (req, res) => {
    res.send('Hello World!');
});
exports.default = router;
//# sourceMappingURL=app.js.map