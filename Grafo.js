class Grafo {
    /**
     * L'insieme dei nodi è rappresentato da un dizionario
     * dove la chiave è la stringa che indentifica il valore del nodo
     * e il campo valore è l'oggetto nodo.
     * 
     * Gli archi invece sono delle stringhe che identificano i due estremi
     * [vedere metodo add_edge per maggiori informazioni].
     * Gli attributi per gli archi sono utili per le informazioni utili per
     * eventuali curvature dell'arco.
     */
    constructor(directed = false) {
        this.directed = directed;
        this.nodi = {};
        this.archi = [];
    }

    /**
     * Dato un valore v e degli attributi crea un nuovo nodo
     * nel grafo.
     * Se v è già esistente semplicemente ne aggiorna gli attributi
     * @param v Object
     * @param attr Dict
     */
    add_node(v, attr) {
        if(! (v in this.nodi) ){
            this.nodi[v] = new Nodo(v, attr);
        }
        else {
            this.nodi[v].update(attr);
        }
    }

    /**
     * @deprecated
     * Data una lista di valori li inserisce nel grafo
     * @para nodes Array
     */
    add_nodes_from(nodes) {
        for(let v of nodes) {
            this.nodi[v] = new Nodo(v);
        }
    }

    /**
     * Dati due valori u, v inserisce un arco tra i rispettivi nodi
     * con peso w.
     * Se l'arco è già presente semplicemente aggiorna il peso.
     * @param u Object
     * @param v Object
     * @param w number
     */
    add_edge(u, v, w){

        /**
         * Siano i nodi u e v ordinati in maniera alfabetica ( String(u) < String(v) ).
         * Allora l'arco tra u e v è rappresentato con la stringa
         * "u,v"
         */

        const e = [u,v].sort().toString();

        if(this.archi.includes(e)) {
            this.nodi[u].vicini[v].weigth = w;
            this.nodi[v].vicini[u].weigth = w;
            return;
        }

        if ( e in this.archi ) {
            // se l'arco gia' esiste, aggiorno solamente il peso
            this.nodi[u].vicini[v].weigth = w;
            this.nodi[v].vicini[u].weigth = w;
            return;
        }

        // Altrimenti aggiunge i nodi u, v se non dovessero essere presenti

        if( !this.nodi[u] ) {
            this.add_node(u);
        }

        if( !this.nodi[v] ) {
            this.add_node(v);
        }

        // li rendo rispettivamente vicini, con peso w
        this.nodi[u].aggiungiVicino(this.nodi[v], w);
        this.nodi[v].aggiungiVicino(this.nodi[u], w);

        //aggiungo l'arco e al grafo
        this.archi.push( e );
    }

    /**
     * Funzione che dati due valori u, v rimuovle l'arco
     * tra i due nodi relativamente associati
     * @param u 
     * @param v  
     */
    remove_edge(u, v) {
        //verifico che l'arco sia presente nel grafo
        const e = [u,v].sort().toString();

        if(this.archi.includes(e)) {
            this.nodi[u].rimuoviVicino(v);
            this.nodi[v].rimuoviVicino(u);
            this.archi = this.archi.filter(
                function(element) { return element != e; }
            )
        }
    }

    /**
     * Funzione che dati due valori u, v ritorna True
     * se esiste l'arco tra i due nodi relativamente associati,
     * False altrimenti
     * @param u 
     * @param v  
     */
    contains_edge(u, v) {
        //verifico che l'arco sia presente nel grafo
        const e = [u,v].sort().toString();
        return this.archi.includes(e);
    }

    /**
     * Dato un punto (x, y) ritorna il nodo che si trova nello
     * stesso ponto del punto.
     * Altrimenti non ritorna niente [undefined].
     */
    isAbove(x, y) {
        for (let v in this.nodi) {
            if ( this.nodi[v].isAbove(x, y) ) {
                return this.nodi[v];
            }
        }
    }

    /**
     * Metodo che dato un punto (x, y) ritorna l'ancora
     * che si trova nello stesso ponto del punto.
     * Altrimenti non ritorna niente [undefined].
     */
    getAnchor(x, y) {
        for (let v in this.nodi) {
            for(let u in this.nodi[v].vicini) {

                let ancora = this.nodi[v].vicini[u].ancora;
                let r = 5;

                if(
                    x >= ancora.x - r  &&
                    x <= ancora.x + r  &&
                    y >= ancora.y - r  &&
                    y <= ancora.y + r
                ) {
                    return ancora;
                }
            }
        }
    }

    show(showWeight = true){

        strokeWeight(1);
        stroke(0);
        
        for (let e of this.archi) {

            let [u, v] = e.split(",");
            let ancora_u = this.nodi[u].vicini[v].ancora;
            let ancora_v = this.nodi[v].vicini[u].ancora;

            noFill();
            stroke(0);
            strokeWeight(1);
            bezier(
                this.nodi[u].attr.pos.x, this.nodi[u].attr.pos.y,
                ancora_u.x, ancora_u.y,
                ancora_v.x, ancora_v.y,
                this.nodi[v].attr.pos.x, this.nodi[v].attr.pos.y
                );

            
            // se l'arco ha un peso lo scrivo
            if( this.nodi[u].vicini[v].weigth  && showWeight ){

                let xpos = bezierPoint(
                    this.nodi[u].attr.pos.x,
                    ancora_u.x,
                    ancora_v.x,
                    this.nodi[v].attr.pos.x,
                    0.5
                );

                let ypos = bezierPoint(
                    this.nodi[u].attr.pos.y,
                    ancora_u.y,
                    ancora_v.y,
                    this.nodi[v].attr.pos.y,
                    0.5
                );

                fill(255);
                stroke(0);
                rect(xpos-2, ypos-12, 8*(this.nodi[u].vicini[v].weigth.toString().length), 13);


                fill(0);
                noStroke();
                text(this.nodi[u].vicini[v].weigth, xpos, ypos);


            }
        }
        
        // Mostro i nodi
        for (let v in this.nodi) {
            this.nodi[v].show();
        }


        // Mostro eventuali ancore
        if (show_anchors) {
            for (let e of this.archi) {
                let [u, v] = e.split(",");
                let ancora_u = this.nodi[u].vicini[v].ancora;
                let ancora_v = this.nodi[v].vicini[u].ancora;

                stroke(255,0,0,100);
                line(
                    this.nodi[u].attr.pos.x, this.nodi[u].attr.pos.y,
                    ancora_u.x, ancora_u.y,
                );
                line(
                    ancora_v.x, ancora_v.y,
                    this.nodi[v].attr.pos.x, this.nodi[v].attr.pos.y
                );

                strokeWeight(1);
                stroke(0);
                fill(255);
                ellipse(ancora_u.x, ancora_u.y, 5, 5);
                ellipse(ancora_v.x, ancora_v.y, 5, 5);

            }
        }

    }
}