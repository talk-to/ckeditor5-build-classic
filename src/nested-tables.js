import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class NestedTables extends Plugin {
	init() {
		const editor = this.editor;
		editor.model.schema.on( 'checkChild', ( evt, args ) => {
        const context = args[ 0 ];
        const childDefinition = args[ 1 ];
        if ( context.endsWith( 'tableCell' ) && childDefinition && childDefinition.name == 'table' ) {
            // Prevent next listeners from being called.
            evt.stop();
            // Set the checkChild()'s return value.
            evt.return = true;
        }
        }, { priority: 'highest' } );
	}
}
