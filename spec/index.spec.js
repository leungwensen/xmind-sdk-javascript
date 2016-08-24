mocha.setup('bdd');

require('./legend.spec');
require('./relationship.spec');
require('./sheet.spec');
require('./topic.spec');
require('./workbook.spec');
require('./xmind.spec');

mocha.run();
