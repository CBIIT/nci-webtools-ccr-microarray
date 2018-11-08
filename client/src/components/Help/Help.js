import React, { Component } from 'react';

class Help extends Component {

	constructor(props){
		super(props);
	}

	componentDidMount(){
	}

  render() {
      return (
        <div className="container container-board">
                    <section >
                        <h2>Microarrays</h2>
                        <div>
                            <p>
                                MicroArray Analysis Pipeline (MAAPster) is a comprehensive web tool designed by the CCR Collaborative Bioinformatics Resource (CCBR) that performs transcriptome analysis of human or mouse Affymetrix gene expression data.  Samples may be uploaded locally or pulled from publicly available data by entering a GEO Series identification number.  MAAPster is able to analyze data from a single experiment, or GEO Series, and allows for the investigation of multiple contrasts between groups of samples. Raw CEL files are analyzed using several Bioconductor packages in ‘R’, including limma, oligo, and gsva (Carvalho & Irizarry, 2010; Hanzelmann, Castelo, & Guinney, 2013; Ritchie et al., 2015).  Output includes quality control plots, differential gene expression analysis, gene expression heatmaps, pathway analysis and single sample GSEA analysis.
                             </p>
                        </div>
                         <h3>Input</h3>
                         <p>There are 2 input options:</p>
                         <ul>
                          <li>1)  Local: Analyze expression data by uploading CEL files from a local computer.  Data must be expression data in CEL file format, and all data must be from the same type of Affymetrix chip.</li>
                          <li>
                            <p>2)  GEO: Analyze expression data from the Gene Expression Omnibus (GEO) https://www.ncbi.nlm.nih.gov/geo/ by providing the relevant series ID from the experiment, as noted below.  Enter the entire ID, starting with GSE. The experiment must include data in CEL file format from the same type of Affymetrix chip.
                          </p>
                          <p>Currently, microRNA and single-cell analyses are not supported.</p></li>
                         </ul>

                          <h3>Human:</h3>
                            <ul>
                                <li>Human Genome U133 Plus 2.0 Array</li>
                                <li>GeneChip™ Human Genome U133A Array</li>
                                <li>GeneChip™ Human Genome U133A 2.0 Array</li>
                                <li>GeneChip™ Human Genome U133B Array</li>
                                <li>GeneChip™ Human Gene 1.0 ST Array (v1 & v2)</li>
                                <li>GeneChip™ Human Gene 1.1 ST Array Version 1</li>
                                <li>GeneChip™ Human Gene 2.0 ST Array</li>
                                <li>Clariom™ S Assay HT, human</li>
                                <li>Clariom™ S Assay, human</li>
                                <li>Human Genome U219 Array</li>
                                <li>GeneChip Human Genome U95 Version 2</li>
                                <li>GeneChip™ Human Transcriptome Array 2.0</li>
                                <li>Human Exon 1.0 ST Array</li>
                            </ul>

                            <h3>Mouse:</h3>
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


                              <h3>Analysis</h3>
                              <p>Once the files are uploaded, choose groups for each sample.  At least 2 groups must be created.</p>
                              <p>PIC</p>
                                <p>Next, choose contrasts to compare.</p>
                            <p>PIC</p>

                            <h4>Array Probe Quality Control:</h4>
                            <p>Two plots, NUSE and RLE, display quality control metrics for the microarray probes.  Plots are created with the oligo package:</p>


                    </section>
        </div>
      );
  }
}

export default Help;