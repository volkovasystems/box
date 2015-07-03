/*:
	The purpose of Box.

	Box wraps your component and let's you attach behaviour that let's you manipulate the component.

	So, basically, box is a wrapper that delegate manipulative behaviour to your component.

	The two basic behaviour is attach and crush.

	Attach behaviour let's you mount/render your component to the DOM world.

	Crush behaviour let's you invoke destruction to your component.
		Note: 
			I use the word invoke because crush method should not directly destroy your component.

			Your box wrapper simply delegate. 
			If it directly destroys your component then it violates the delegation principle.
*/
angular
	
	.module( "Box", [ ] )

	//: This will become bigger but we need a single in-memory reference to all the boxes.
	.constant( "BOX_CONTAINER_LIST", [ ] )

	.factory( "Box", [
		function factory( ){
			var Box = function Box( elementClass ){
				if( this instanceof Box ){
					this.elementClass = elementClass;

					this.instanceList = [ ];

				}else{
					return new Box( elementClass );
				}
			};

			/*:
				initializeBox returns an instanceData object containing instance, container and element.

				Instance is the created element instance not yet rendered.

				Container is where we render the element instance.

				Element is now the element instance rendered.

				This will be called inside the attach method of the elementClass
			*/
			Box.prototype.initializeBox = function initializeBox( container, propertySet ){
				var elementClass = this.elementClass;

				container = $( container )[ 0 ];

				//: Note: THIS IS WRONG!
				var elementInstance = React.createElement( elementClass, propertySet );

				//: This will let us track and manipulate the instances created by this box.
				var instanceData = {
					"instance": elementInstance,
					"container": container
				};

				this.instanceList.push( instanceData );

				//: Note: THIS IS WRONG!
				var renderedElement = React.render( elementInstance, container );

				//: We need this because it is totally different from elementInstance.
				instanceData.element = renderedElement;

				return instanceData;
			};

			/*:
				configureBox attaches initialize and configure to the renderedElement
					so that we can incorporate the initialize-configure pattern to DOM components.
			*/
			Box.prototype.configureBox = function configureBox( instanceData, optionSet, propertySet ){
				var renderedElement = instanceData.element;

				if( !_.isEmpty( optionSet ) &&
					"initialize" in optionSet &&
					typeof optionSet.initialize == "function" )
				{
					//: And yes this will override so be careful.
					renderedElement.initialize = optionSet.initialize;
				}

				if( !_.isEmpty( optionSet ) &&
					"configure" in optionSet &&
					typeof optionSet.configure == "function" )
				{
					//: Same with the initialize method, this will override the default configure behaviour.
					//: Note that I made it like this because this will change the entire component.
					//: The previous initialize and configure method may conflict with the new ones.
					renderedElement.configure = optionSet.configure;	
				}

				if( typeof renderedElement.initialize == "function" &&
					!_.isEmpty( propertySet ) )
				{
					//: Property set should be passed to the initialize method.
					renderedElement.initialize.call( renderedElement, propertySet );
				}

				if( typeof renderedElement.configure == "function" && 
					!_.isEmpty( optionSet ) )
				{
					//: Option set should be passed to the configure method.
					//: Optionally, some components may want the initial values from the propertySet.
					//: We will not provide a check for this. 
					//: This is left to the developers to ensure that propertySet contains something.
					renderedElement.configure.call( renderedElement, optionSet, propertySet );  
				}
			};
  
  			/*:
  				This will add essential methods to the element's class.

  				This will also gives the notion that we are wrapping a UI component as a box.
  			*/
			Box.prototype.wrapAsBox = function wrapAsBox( ){
				var self = this;

				var elementClass = this.elementClass;

				/*:
					We need to redefine the purpose of this attach method because this tends to get bigger.

					Let's define currently what are implemented here.
						1. We created a react element from the element class.
						2. We push the instance and container to the instance list of this box instance.
						3. We render the instance.
						4. We attach initialize and configure functions.
						5. We call initialize and configure functions.

					Note: 
						a. Does box responsible for creating the element instance?
						a.1 Does box also responsible for pushing the instance data to the instance list?
						b. Can we remove (a) and (a.1) from the attach method 
							and invoke them somewhere else when the attach method is invoked?

					To answer, we will try to recode these into initializeBox method and configureBox method.
				*/
				elementClass.attach = function attach( container, propertySet, optionSet ){
					var instanceData = self.initializeBox( container, propertySet );

					self.configureBox( instanceData, optionSet, propertySet );

					//: We return the class because attach is a class function.
					return elementClass;  
				};
			};

			//: Destroy the box and its contents.
			//: Note that this may destroy the entire components created using this box.
			//: Providing a reference will selectively destroy that component.
			Box.prototype.crushBox = function crushBox( reference ){
				//: Now the reference may be a jQuery instance, a string reference, or a native DOM instance.

				var instanceList = this.instanceList;

				if( !_.isEmpty( reference ) ){
					var container = _.find( instanceList,
						function onEachInstanceList( instanceData ){
							return instanceData.container === $( reference )[ 0 ];
						} ).container;

					//: Note: THIS IS WRONG!
					React.unmountComponentAtNode( container );

				}else{
					_.each( instanceList,
						function onEachInstanceList( instanceData ){
							//: Note: THIS IS WRONG!
							React.unmountComponentAtNode( instanceData.container );
						} );
				}
			};

			return Box;
		}
	] )

	/*:
		Boxify creates an instance around the element class.
		And invoke the wrap method.

		It will also push the new box to the container list for tracking.
	*/
	.factory( "boxify", [
		"Box",
		"BOX_CONTAINER_LIST",
		function factory( Box, BOX_CONTAINER_LIST ){
			var boxify = function boxify( elementClass ){
				var newBox = Box( elementClass ); 

				newBox.wrapAsBox( ); 

				BOX_CONTAINER_LIST.push( newBox );

				return newBox;
			};

			return boxify;
		}
	] );