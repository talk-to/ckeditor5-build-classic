import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class PreserveStyles extends Plugin {
	init() {
		const editor = this.editor;
		const tags = ['table', 'tr', 'td', 'tbody', 'a', 'img'];
		for (const tag of tags) {
			const method = editor.model.schema.isRegistered(tag) ? 'extend' : 'register';
			editor.model.schema[method]( tag, {
				allowAttributes: 'customStyle'
			} );
			editor.conversion.for( 'downcast' ).attributeToElement( {
				model: 'customStyle',
				view: ( attributeValue, writer ) => {
					const linkElement = writer.createAttributeElement( tag, { style: attributeValue }, { priority: 5 } );
					writer.setCustomProperty( 'link', true, linkElement );
					return linkElement;
				},
				converterPriority: 'low'
			} );
			editor.conversion.for( 'upcast' ).attributeToAttribute( {
				view: {
					name: tag,
					key: 'style'
				},
				model: 'customStyle',
				converterPriority: 'low'
			} );
		}
	}
}
