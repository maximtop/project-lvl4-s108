const User = require("./User")
// @ponicode
describe("User.default", () => {
    test("0", () => {
        let callFunction = () => {
            User.default({ define: () => false })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            User.default({ define: () => true })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            User.default(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
