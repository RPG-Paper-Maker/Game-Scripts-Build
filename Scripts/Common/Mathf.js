/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
/**
 * Static math utilities used across the engine.
 *
 * This class is non-instantiable: all members are static.
 */
export class Mathf {
    static roundDecimalFour(num) {
        return Math.round(num * 1e4) / 1e4;
    }
    /**
     * Cosine with rounding to reduce floating errors.
     * @param v Angle in radians.
     * @returns Cosine(v) rounded to 10 decimals.
     */
    static cos(v) {
        return Number(Math.cos(v).toFixed(10));
    }
    /**
     * Sine with rounding to reduce floating errors.
     * @param v Angle in radians.
     * @returns Sine(v) rounded to 10 decimals.
     */
    static sin(v) {
        return Number(Math.sin(v).toFixed(10));
    }
    /**
     * Mathematical modulo that never returns a negative result.
     * @param x Dividend.
     * @param m Divisor.
     * @returns x mod m in [0, m).
     */
    static mod(x, m) {
        const r = x % m;
        return r < 0 ? r + m : r;
    }
    /**
     * Get the maximum numeric ID in a list.
     * @param list Array of numbers (IDs).
     * @returns Maximum value found, or 0 for an empty list.
     */
    static getMaxID(list) {
        let max = 0;
        for (let i = 0, l = list.length; i < l; i++) {
            max = Math.max(list[i], max);
        }
        return max;
    }
    /**
     * Inclusive random integer in [min, max].
     * @param min Minimum value.
     * @param max Maximum value.
     */
    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    /**
     * Returns a random value around `value` within a ±`variance`% range.
     * @param value Base value.
     * @param variance Percentage variance (e.g., 20 for ±20%).
     */
    static variance(value, variance) {
        const v = Math.round((value * variance) / 100);
        return this.random(value - v, value + v);
    }
    /**
     * Checks if a 2D point lies inside (or on the border of) an axis-aligned rectangle.
     * @param p Point to test.
     * @param x1 Left X.
     * @param x2 Right X.
     * @param y1 Top Y.
     * @param y2 Bottom Y.
     */
    static isPointOnRectangle(p, x1, x2, y1, y2) {
        return p.x >= x1 && p.x <= x2 && p.y >= y1 && p.y <= y2;
    }
    /**
     * Checks if a 2D point lies inside a triangle defined by (p0, p1, p2).
     * Uses an area/sign method equivalent to barycentric containment.
     * @param p Point to test.
     * @param p0 Triangle vertex.
     * @param p1 Triangle vertex.
     * @param p2 Triangle vertex.
     */
    static isPointOnTriangle(p, p0, p1, p2) {
        const a = 0.5 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
        const sign = a < 0 ? -1 : 1;
        const s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
        const t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;
        return s > 0 && t > 0 && s + t < 2 * a * sign;
    }
    /**
     * Orthogonal projection length of vector `u` onto vector `v`.
     * @param u Vector being projected.
     * @param v Direction vector of the projection.
     * @returns The scalar length of the projection of `u` on `v`.
     */
    static orthogonalProjection(u, v) {
        const lu = u.length();
        const lv = v.length();
        const dot = u.dot(v);
        return (dot / (lu * lv)) * lu;
    }
    /**
     * Random percentage test.
     * @param chance Percentage in [0, 100].
     * @returns `true` with probability = `chance`%.
     */
    static randomPercentTest(chance) {
        return chance > 0 && this.random(0, 100) <= chance;
    }
    /**
     * Formats a number with commas for thousands (e.g., 1234567 → "1,234,567").
     * @param x Number to format.
     */
    static numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    /**
     * Convert radians to degrees.
     * @param radians Angle in radians.
     */
    static radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }
    /**
     * Convert degrees to radians.
     * @param degrees Angle in degrees.
     */
    static degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    /**
     * Rotates a vertex around an arbitrary axis passing through a center.
     * Mutates `vec` in place.
     * @param vec Vertex to rotate.
     * @param center Rotation center.
     * @param angle Angle value (degrees by default).
     * @param axis Rotation axis.
     * @param isDegree If `true`, interprets `angle` as degrees; otherwise radians.
     */
    static rotateVertex(vec, center, angle, axis, isDegree = true) {
        vec.sub(center);
        vec.applyAxisAngle(axis, isDegree ? (angle * Math.PI) / 180.0 : angle);
        vec.add(center);
    }
    /**
     * Rotates a vertex around a center using Euler angles.
     * Mutates `vec` in place.
     * @param vec Vertex to rotate.
     * @param center Rotation center.
     * @param euler Euler rotation to apply.
     */
    static rotateVertexEuler(vec, center, euler) {
        vec.sub(center);
        vec.applyEuler(euler);
        vec.add(center);
    }
    /**
     * Rotate a quadrilateral around a center point using Euler angles.
     * This applies the same Euler rotation to the four vertices of a quad
     * (`vecA`, `vecB`, `vecC`, `vecD`) around a given `center`.
     * Modifies the vectors in place.
     * @param vecA - First vertex of the quad.
     * @param vecB - Second vertex of the quad.
     * @param vecC - Third vertex of the quad.
     * @param vecD - Fourth vertex of the quad.
     * @param center - The pivot point around which to apply the rotation.
     * @param euler - The Euler rotation to apply.
     */
    static rotateQuadEuler(vecA, vecB, vecC, vecD, center, euler) {
        this.rotateVertexEuler(vecA, center, euler);
        this.rotateVertexEuler(vecB, center, euler);
        this.rotateVertexEuler(vecC, center, euler);
        this.rotateVertexEuler(vecD, center, euler);
    }
}
/**
 * Comparison operator table.
 * Index mapping is expected by callers:
 * 0: ===, 1: !==, 2: >=, 3: <=, 4: >, 5: <
 */
Mathf.OPERATORS_COMPARE = Object.freeze([
    (a, b) => a === b,
    (a, b) => a !== b,
    (a, b) => a >= b,
    (a, b) => a <= b,
    (a, b) => a > b,
    (a, b) => a < b,
]);
/**
 * Numeric operator table.
 * Index mapping is expected by callers:
 * 0: assign (return b), 1: +, 2: -, 3: *, 4: /, 5: %
 */
Mathf.OPERATORS_NUMBERS = Object.freeze([
    (_a, b) => b,
    (a, b) => a + b,
    (a, b) => a - b,
    (a, b) => a * b,
    (a, b) => a / b,
    (a, b) => a % b,
]);
