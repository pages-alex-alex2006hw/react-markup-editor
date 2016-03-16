var draft = require('draft-js');

// Strategy function for a decorator to find all entities by types
function findEntityByType(type) {
    return function(contentBlock, callback) {
        contentBlock.findEntityRanges(function(character) {
            var entityKey = character.getEntity();
            return (entityKey !== null && draft.Entity.get(entityKey).getType() === type);
        }, callback);
    };
}

module.exports = findEntityByType;
