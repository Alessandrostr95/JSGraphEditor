class Nodo{
    constructor(value, attr) {
        this.value = value;
        this.attr = {
            pos: createVector(random(width), random(height)),
            radius: 5,
            colore: color('black'),
            label: true,
        }
        Object.assign(this.attr, attr);

        this.vicini = {};
    }

    /**
     * Rende il nodo u vicino del nodo che ha chiamato il metodo.
     * @param u Nodo
     * @param w peso
     */
    aggiungiVicino(u, w) {
        this.vicini[u.value] = {
            nodo: u,
            weigth: w,
            //ancora: p5.Vector.lerp(this.attr.pos, u.attr.pos, 0.1),
            ancora: this.attr.pos.copy(),
            /* Se l'ancora è fissa (true) allora le sue coordinate
             * non variano al muoversi del rispettivo nodo.
             * Se invece non è fissa (false) le coordinate dell'ancora
             * si muovo parallelamente al nodo
             */
            ancora_fissa: false
        }   
    }

    /**
     * Rimuove il nodo u dal vicinato
     */
    rimuoviVicino(u) {
        delete this.vicini[u];
    }

    /**
     * Dati degli attributi aggiorna quelli del nodo
     * che chiama il metodo
     * @param attr Dict
     */
    update(attr) {
        Object.assign(this.attr, attr);
    }

    isAbove(x, y) {
        return (
            x >= this.attr.pos.x - this.attr.radius  &&
            x <= this.attr.pos.x + this.attr.radius  &&
            y >= this.attr.pos.y - this.attr.radius  &&
            y <= this.attr.pos.y + this.attr.radius
        );
    }

    /**
     * 
     */
    show() {
        
        fill(this.attr.colore);
        strokeWeight(1);
        stroke(0);
        ellipse(this.attr.pos.x, this.attr.pos.y, this.attr.radius*2, this.attr.radius*2);

        if (this.attr.label) {
            textSize(12);
            fill(0);
            text(this.value, this.attr.pos.x + this.attr.radius*2, this.attr.pos.y + this.attr.radius*2);
        }

    }
}