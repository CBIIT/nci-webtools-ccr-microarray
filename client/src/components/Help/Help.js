import React, { Component } from 'react';

class Help extends Component {

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
                                MicroArray Analysis Pipeline (MAAPster) is a comprehensive web tool designed by the CCR Collaborative Bioinformatics Resource (CCBR) that performs transcriptome analysis of human or mouse Affymetrix gene expression data.  Samples may be uploaded locally or pulled from publicly available data by entering a GEO Series identification number.  MAAPster is able to analyze data from a single experiment, or GEO Series, and allows for the investigation of multiple contrasts between groups of samples. Raw CEL files are analyzed using several Bioconductor packages in ‘R’, including limma, oligo, and gsva (Carvalho & Irizarry, 2010; Hanzelmann, Castelo, & Guinney, 2013; Ritchie et al., 2015).  Output includes quality control plots, differential gene expression analysis, gene expression heatmaps, pathway analysis and single sample GSEA analysis.
                             </p>
                        </div>
                         <h3>Input</h3>
                         <p>There are 2 input options:</p>
                         <ul>
                          <li><p>1)  Local: Analyze expression data by uploading CEL files from a local computer.  Data must be expression data in CEL file format, and all data must be from the same type of Affymetrix chip.</p>
                              <p><img src="./assets/img/loading-upload-file.gif" alt="National Cancer Institute" /></p>
                            </li>
                          <li>
                            <p>2)  GEO: Analyze expression data from the Gene Expression Omnibus (GEO) https://www.ncbi.nlm.nih.gov/geo/ by providing the relevant series ID from the experiment, as noted below.  Enter the entire ID, starting with GSE. The experiment must include data in CEL file format from the same type of Affymetrix chip.
                          </p>
                          <p><img src="./assets/img/loading-with-accession-data.gif" alt="National Cancer Institute" /></p>
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
                               <p>Next, choose contrasts to compare.</p>
                               <p>The control group should be entered last.</p>
                               <p>For example:</p>
                               <p><div style={{"paddingLeft":"26px"}}>
                               Disease<br/>
                               VS<br/>
                               Control<br/>
                               </div>
                               </p>
                               <p><img src="./assets/img/group.gif" alt="National Cancer Institute" /></p>
          

                            <h4>Array Probe Quality Control:</h4>
                            <p>Two plots, NUSE and RLE, display quality control metrics for the microarray probes.  Plots are created with the oligo package:</p>
                            <ul>
                              <li>
                                <p>The Normalized Unscaled Standard Error (NUSE) plot shows standard error estimates for each sample.  These estimates are normalized to 1 across all samples, so a sample with a significantly higher value may be of lower quality (Carvalho & Irizarry, 2010).   </p>
                                 <p><img src="./assets/img/nuse.gif" alt="National Cancer Institute" /></p>
          
                              </li>
                              <li>
                                <p>The Relative Log Expression (RLE) plot compares the expression level of one probeset to the median expression of that probeset across all samples.  </p>
                                    <p><img src="./assets/img/RLE.gif" alt="National Cancer Institute" /></p>
          
                              </li>
                            </ul>
                          <p>
                          Details regarding NUSE and RLE can be found in the oligo manual (Carvalho & Irizarry, 2010):
                          <a href="https://www.bioconductor.org/packages/release/bioc/vignettes/oligo/inst/doc/oug.pdf">https://www.bioconductor.org/packages/release/bioc/vignettes/oligo/inst/doc/oug.pdf</a>
                          </p>

                           <h3>Normalization:</h3>
                           <p>Each sample is normalized to correct for technical artifacts using the Robust Multichip Averaging (RMA) method described in (Irizarry et al., 2003). Pre-normalization and post-normalization histograms, MA plots and box plots display relative expression (represented by probe intensity) before and after RMA.  Data for the plots are generated with the oligo package.</p>
                           <p>Histogram: The histogram displays the density of probes at each log-intensity. Each sample is represented by a line.  After RMA, all samples lines should follow the same curve.</p>
                            <p><img src="./assets/img/histogram.gif" alt="National Cancer Institute" /></p>
          
                           <p>MA plot: Log-ratios (M) are plotted against the average log-intensities (A). Plots are generated that compare each sample to the median of all samples. After RMA, the red sample line should be relatively equal to the blue median line.</p>
                            <p><img src="./assets/img/MAplot.gif" alt="National Cancer Institute" /></p>
          
                           <p>Boxplot: Displays the distribution of log-intensities for each sample. After RMA, distributions across all samples should be approximately the same.</p>
                            <p><img src="./assets/img/boxplot.gif" alt="National Cancer Institute" /></p>
          
                             <p>
                         Details regarding plots described above can be found in the oligo manual (Carvalho & Irizarry, 2010): 
                          <a href="https://www.bioconductor.org/packages/release/bioc/vignettes/oligo/inst/doc/oug.pdf">https://www.bioconductor.org/packages/release/bioc/vignettes/oligo/inst/doc/oug.pdf</a>
                          </p>


                          <h3>Sample Quality Control:</h3>
                           <p>Two plots, the sample similarity heatmap and 3D PCA, provide information about the quality of replicates in the groups.  In general, samples in the same group should cluster together, and groups of samples should cluster separately from other groups. </p>
                           <h4>3D PCA:</h4>
                            <p><img src="./assets/img/PCA.gif" alt="National Cancer Institute" /></p>
                           <h4>Sample Similarity Heatmap:</h4>

                           <p><img src="./assets/img/heatmap.gif" alt="National Cancer Institute" /></p>
          


                            <h3>Differential Gene Expression:</h3>
                           <p>After normalization, determine differential gene expression between groups.  MAAPster runs analysis in the background with the limma package. Linear modeling is performed using limma’s lmFit function, and differential gene expression is determined using the contrasts.fit and eBayes functions (Ritchie et al, 2015).  Using the toptable function, false discovery rates are calculated to adjust p-values for multiple testing (Ritchie et al., 2015).  Detailed information regarding differential expression analysis can be found in the limma manual 
                           <a href="https://www.bioconductor.org/packages/release/bioc/vignettes/limma/inst/doc/usersguide.pdf"> https://www.bioconductor.org/packages/release/bioc/vignettes/limma/inst/doc/usersguide.pdf.</a></p>
                            <p><img src="./assets/img/deg.gif" alt="National Cancer Institute" /></p>
          


                             <h3>Pathway Analysis:</h3>
                           <p>The top 500 significantly upregulated and top 500 significantly downregulated genes are extracted for pathway analysis (significance is determined as unadjusted p-value  &lt; 0.05), Pathway analysis is performed with CCBR’s l2p software</p>
                            <h4>Gene Heatmaps:</h4>
                            <p>Click on a pathway to generate a heatmap for the genes in the pathway.  The heatmap will include groups selected in the contrast, and will display scaled normalized gene expression for samples in the groups.  </p>
                            
                            <p><img src="./assets/img/pathway.gif" alt="National Cancer Institute" /></p>
          

                      

                            <h3>Single-sample GSEA (ssGSEA):</h3>
                            <p>
                          
                            ssGSEA is performed using the gsva package as described in (Hanzelmann et al., 2013).  Pathway enrichment scores are then analyzed to determine fold changes and p-values between groups of samples, similar to the differential gene expression analysis described above.  Differential pathway enrichment is ranked by p-value, and the top 50 pathways are displayed in a heatmap.  Human gene set modules were downloaded from the BROAD Institute’s MSigDB 
                              <a href="http://software.broadinstitute.org/gsea/msigdb/collections.jsp">(http://software.broadinstitute.org/gsea/msigdb/collections.jsp)</a>, 
                            and mouse gene set modules were adapted from the Walter+Eliza Hall Institute of Medical Research 
                             <a href="http://bioinf.wehi.edu.au/software/MSigDB/">(http://bioinf.wehi.edu.au/software/MSigDB/)</a>. 

                            </p>
                              <p><img src="./assets/img/ssGSEA.gif" alt="National Cancer Institute" /></p>
          
                            <h3>Download Results:</h3>
                            <p>All tables and plots generated may be downloaded.</p>



                               <h3>References:</h3>
<ul>

<li>Carvalho, B. S., & Irizarry, R. A. (2010). A framework for oligonucleotide microarray preprocessing. Bioinformatics, 26(19), 2363-2367. doi:10.1093/bioinformatics/btq431</li>
<li>Hanzelmann, S., Castelo, R., & Guinney, J. (2013). GSVA: gene set variation analysis for microarray and RNA-seq data. BMC Bioinformatics, 14, 7. doi:10.1186/1471-2105-14-7</li>
<li>Irizarry, R. A., Hobbs, B., Collin, F., Beazer-Barclay, Y. D., Antonellis, K. J., Scherf, U., & Speed, T. P. (2003). Exploration, normalization, and summaries of high density oligonucleotide array probe level data. Biostatistics, 4(2), 249-264. doi:10.1093/biostatistics/4.2.249</li>
<li>Ritchie, M. E., Phipson, B., Wu, D., Hu, Y., Law, C. W., Shi, W., & Smyth, G. K. (2015). limma powers differential expression analyses for RNA-sequencing and microarray studies. Nucleic Acids Res, 43(7), e47. doi:10.1093/nar/gkv007</li>
</ul>

                    </section>
        </div>
        );
    }
}

export default Help;