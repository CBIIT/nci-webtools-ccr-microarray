import React, { Component } from 'react';

class About extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="container container-board">
                    <section >
                        <div>
                            <p>
                                MicroArray Analysis Pipeline (MAAPster) is a comprehensive web tool designed by the CCR Collaborative Bioinformatics Resource (CCBR) that performs transcriptome analysis of human or mouse Affymetrix gene expression data. Samples may be uploaded locally or accessed from published data by entering a GEO Series identification number. MAAPster can analyze data from a single experiment that includes multiple samples, and the user may investigate multiple contrasts between groups of samples. Raw CEL files are analyzed using several Bioconductor packages in ‘R’, including limma and oligo. Output includes array probe quality control plots, sample quality control plots such as 3D PCA, differential gene expression analysis, gene expression heatmaps, pathway analysis and single sample GSEA analysis. 
                            </p>
                        
                            <p>
                                The pipeline supports the following commonly used Affymetrix chips. More may be added upon request.
                            </p>
                            <h3>Human</h3>
                            <ul>
                                <li>Human Genome U133 Plus 2.0 Array</li>
                                <li>GeneChip™ Human Genome U133A Array</li>
                                <li>GeneChip™ Human Genome U133A 2.0 Array</li>
                                <li>GeneChip™ Human Genome U133B Array</li>
                                <li>GeneChip™ Human Gene 1.0 ST Array (v1 & v2)</li>
                                <li>GeneChip™ Human Gene 1.1 ST Array Version 1</li>
                                <li>GeneChip™ Human Gene 2.0 ST Array</li>
                                <li>GeneChip™ Human Gene 2.1 ST</li>
                                <li>Clariom™ S Assay HT, human</li>
                                <li>Clariom™ S Assay, human</li>
                                <li>Human Genome U219 Array</li>
                                <li>GeneChip Human Genome U95 Version 2</li>
                                <li>GeneChip™ Human Transcriptome Array 2.0</li>
                                <li>Human Exon 1.0 ST Array</li>
                            </ul>

                            <h3>Mouse</h3>
                            <ul>
                                <li>GeneChip™ Mouse Gene 1.0 ST Array</li>
                                <li>GeneChip™ Mouse Gene 1.1 ST Array</li>
                                <li>GeneChip™ Mouse Gene 2.0 ST Array</li>
                                <li>Clariom™ S Assay HT, mouse</li>
                                <li>Clariom™ S Assay, mouse</li>
                                <li>GeneChip™ Mouse Genome 430 2.0 Array</li>
                                <li>GeneChip™ Mouse Genome 430A 2.0 Array</li>
                                <li>GeneChip® Mouse Expression Set 430</li>
                                <li>GeneChip® Murine Genome U74v2 Set</li>
                                <li>Mouse Exon 1.0 ST Array</li>
                            </ul>

                         </div>
                    </section>
        </div>
        );
    }
}

export default About;