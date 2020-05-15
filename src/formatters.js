import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class Formatters extends Plugin {
    init() {
        const editor = this.editor;
        // let allowedAttributes = [
        //     'width', 'height', 'style', 'class', 'id',  'align',
        //     'border', 'cellspacing', 'cellpadding', 'color', 
        // ];
        const wanted = [
            {
                element: 'div',
                attrs: [ 'class', 'id', 'style', '__style' ],
                isBlock: true
            },
            {
            	element: 'paragraph',
            	attrs: [ 'class', 'style', '__style', 'color', 'id' ],
            	isBlock: true
            	// extend: true,
            },
            {
                element: 'style'
            },
            {
            	element: 'table',
            	attrs: [ 'class', 'style', '__style', 'border', 'width', 'height', 'cellpadding', 'cellspacing', 'id', 'align', 'bgcolor' ],
            	// extend: true,
            },
            {
                element: 'tr',
                attrs: [ 'class', 'border', 'style', '__style', 'border', 'width', 'height', 'cellpadding', 'cellspacing', 'id', 'align', 'bgcolor' ],
                // extend: true,
            },
            {
                element: 'td',
                attrs: [ 'class', 'border', 'style', '__style', 'border', 'width', 'height', 'cellpadding', 'cellspacing', 'id', 'align', 'bgcolor' ],
                // extend: true,
            },
            {
                element: 'tbody',
                attrs: [ 'class', 'border', 'style', '__style', 'border', 'width', 'height', 'cellpadding', 'cellspacing', 'id', 'align', 'bgcolor' ]
                // extend: true,
            },
            {
                element: 'span',
                attrs: [ 'class', 'style', '__style', 'color', 'id' ]
            },
            {
                element: 'a',
                attrs: [ 'class', 'style', '__style', 'color', 'id' ]
            },
            {
                element: 'anchor',
                attrs: [ 'class', 'style', '__style', 'color', 'id' ]
            },
            {
                element: 'image',
                attrs: [ 'class', 'style', '__style', 'width', 'height']
            },
            {
                element: 'img',
                attrs: [ 'class', 'style', '__style', 'width', 'height']
            },
            {
                element: 'h1',
                attrs: [ 'class', 'style' ]
            },
            {
                element: 'h2',
                attrs: [ 'class', 'style' ]
            },
            {
                element: 'h3',
                attrs: [ 'class', 'style' ]
            },
        ];
        window.schemaa = editor.model.schema;
        console.log( { schema: editor.model.schema }, editor.model.schema.getDefinitions() );
        for ( const item of wanted ) {
            const { element, attrs, extend, isBlock } = item;
            let method = 'register';

            if ( extend || editor.model.schema.isRegistered( element ) ) {
                method = 'extend';
            }
            editor.model.schema[ method ]( element, {
                allowWhere: '$block',
                inheritAllFrom: '$block',
                allowContentOf: '$root',
                allowAttributes: attrs
                // isBlock: !!isBlock,
            } );
            editor.conversion.elementToElement( { model: element, view: element } );
            if ( attrs && attrs.length ) {
                for ( const attr of attrs ) {
                editor.conversion.attributeToAttribute( { model: attr, view: attr } );
                }
            }

            editor.conversion.for('upcast').attributeToAttribute({
                model: {
                    key: 'style',
                    name: element
                },
                view: 'style',
                converterPriority: 'low'
            });

            editor.conversion.for('downcast').add(dispatcher => {
                dispatcher.on(`attribute:style:${element}`, (evt, data, conversionApi) => {
                    conversionApi.consumable.consume(data.item, evt.name);
          
                    const viewElement = conversionApi.mapper.toViewElement(data.item);
          
                    conversionApi.writer.setAttribute('style', data.attributeNewValue, viewElement);
                });
            });
        }
    }
}
