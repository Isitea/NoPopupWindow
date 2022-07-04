{
    "use strict"
    class A {
        static A = parseInt( Math.random() * 100 );
        A = parseInt( Math.random() * 100 );
        #A = ( Date( Math.random() * 100000 ) ).toLocaleString();

        constructor ( name ) {
            this.name = name;
            let realName = name.toUpperCase();
            this.getReallyRealName = function () { return realName; };
        }

        getName () {
            return this.name;
        }

        getRealName () {
            return this.realName;
        }

        getDate () {
            return this.#A;
        }
    }

    class AA extends A {
        static A = parseInt( Math.random() * 100 );
        A = parseInt( Math.random() * 100 );
        #A = ( Date( Math.random() * 100000 ) ).toLocaleString();

        constructor ( name ) {
            super( name );
            this.realName = name.toUpperCase();
        }

        getRealName () {
            return super.getReallyRealName();
        }

        getDate () {
            return this.#A;
        }
    }
    console.log( `A.A: ${ A.A }` );

    let B = new A( "Test Case 1" );
    console.log( `B.getName(): ${ B.getName() }` );
    console.log( `B.getRealName(): ${ B.getRealName() }` );
    console.log( `B.getReallyRealName(): ${ B.getReallyRealName() }` );
    console.log( `B.getDate()[#A]: ${ B.getDate() }` );
    console.log( `B.A: ${ B.A }` );

    let C = new A( "Test Case 2" );
    console.log( `C.getName(): ${ C.getName() }` );
    console.log( `C.getRealName(): ${ C.getRealName() }` );
    console.log( `C.getReallyRealName(): ${ C.getReallyRealName() }` );
    console.log( `C.getDate()[#A]: ${ C.getDate() }` );
    console.log( `C.A: ${ C.A }` );

    console.log( "B.A, C.A: ", B.A, C.A );

    B.A = 23;
    console.log( `B.A after B.A = 23;: ${ B.A }` )
    console.log( `C.A after B.A = 23;: ${ C.A }` )

    //Cause Error
    //console.log( "B.#A, C.#A: ", eval( "B.#A" ), eval( "C.#A" ) );

}
{
    class A {
        A = parseInt( Math.random() * 100 );

        constructor () {
        }
        showA () {
            console.log( `A of class A: ${ this.A }` );
        }
        changeA ( v ) {
            this.A = v ** 2;
        }
    }

    let AA = new A();
    AA.showA();
    AA.changeA( 23 );
    AA.showA();

    class B {
        A = parseInt( Math.random() * 100 );

        constructor () {
        }
        showA () {
            console.log( `A of class B: ${ this.A }` );
        }
        changeA ( v ) {
            this.A = this.A ** ( 1 / v );
        }
    }

    let BB = new B();
    BB.showA();
    BB.changeA( 2 );
    BB.showA();

    //BB.changeA = AA.changeA;
    //BB.changeA( 2 );
    AA.changeA.apply( BB, 2 )
    BB.showA();
}