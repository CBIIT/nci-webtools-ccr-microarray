import React, { Component } from 'react';

class About extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        return (
                <div className="container container-board">
                    <section >
                        <h2>Microarrays</h2>
                        <div>
                            <p>
                                Microarrays are a collection of DNA probes that are usually bound in defined positions to a solid surface, such as a glass slide, to which sample DNA fragments can be hybridised. The probes are generally oligonucleotides that are ‘ink-jet printed’ onto slides (Agilent) or synthesised in situ (Affymetrix). Labelled single-stranded DNA or antisense RNA fragments from a sample of interest are hybridised to the DNA microarray under high stringency conditions. The amount of hybridisation detected for a specific probe is proportional to the number of nucleic acid fragments in the sample.
                            </p>
                        </div>
                    </section>
        </div>
        );
    }
}

export default About;